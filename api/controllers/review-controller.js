import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const votesInFlight = new Set();

export const createReview = async (req, res, next) => {
  try {
    const { description, rating, subjectId } = req.body;
    const stars = Number(rating);
    const userId = req.userId;

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
    }

    // Get StudentProfile.id from User.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          select: { id: true }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return res.status(400).json({ message: "Student profile not found" });
    }

    const review = await prisma.review.create({
      data: {
        description: description.trim(),
        rating: stars,
        studentId: user.studentProfile.id,
        subjectId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    // Transform response to match expected format
    const response = {
      ...review,
      user: {
        name: review.student.user.name,
        profileImage: review.student.user.profileImage,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating review:', error);
    next(error);
  }
};

export const getSubjectReviews = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const userId = req.userId;

    // Get user's StudentProfile if logged in
    let studentProfileId = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: {
            select: { id: true }
          }
        }
      });
      studentProfileId = user?.studentProfile?.id;
    }

    const reviews = await prisma.review.findMany({
      where: {
        subjectId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                profileImage: true,
              },
            },
          },
        },
        votes: studentProfileId ? {
          where: {
            studentId: studentProfileId
          },
          select: {
            voteType: true
          }
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform response to match expected format and add userVote
    const transformedReviews = reviews.map(review => {
      const userVote = review.votes && review.votes.length > 0 
        ? review.votes[0].voteType 
        : null;
      
      return {
        ...review,
        user: {
          name: review.student.user.name,
          profileImage: review.student.user.profileImage,
        },
        userVote: userVote,
      };
    });

    res.status(200).json(transformedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          select: { id: true }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return res.status(400).json({ message: "Student profile not found" });
    }

    const reviews = await prisma.review.findMany({
      where: {
        studentId: user.studentProfile.id,
      },
      include: {
        subject: {
          select: {
            subjectName: true,
            id: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    next(error);
  }
};

export const voteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { voteType } = req.body;
  const userId = req.userId;
  let lockKey = null;
  let acquiredLock = false;

  try {
    if (voteType !== 'up' && voteType !== 'down') {
      return res.status(400).json({ message: "Vote must be up or down" });
    }

    // Get StudentProfile.id from User.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          select: { id: true }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return res.status(400).json({ message: "Student profile not found" });
    }

    const studentId = user.studentProfile.id;
    lockKey = `${studentId}:${reviewId}`;

    if (votesInFlight.has(lockKey)) {
      return res.status(409).json({ message: "Vote is already being saved" });
    }

    votesInFlight.add(lockKey);
    acquiredLock = true;

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        return null;
      }

      const existingVote = await tx.reviewVote.findUnique({
        where: {
          studentId_reviewId: {
            studentId,
            reviewId,
          },
        },
      });

      if (existingVote && existingVote.voteType === voteType) {
        await tx.reviewVote.delete({
          where: {
            studentId_reviewId: {
              studentId,
              reviewId,
            },
          },
        });

        const updatedReview = await tx.review.update({
          where: { id: reviewId },
          data: voteType === 'up'
            ? { upvotes: { decrement: 1 } }
            : { downvotes: { decrement: 1 } },
        });

        return {
          upvotes: updatedReview.upvotes,
          downvotes: updatedReview.downvotes,
          userVote: null,
        };
      }

      if (existingVote) {
        await tx.reviewVote.update({
          where: {
            studentId_reviewId: {
              studentId,
              reviewId,
            },
          },
          data: { voteType },
        });

        const updatedReview = await tx.review.update({
          where: { id: reviewId },
          data: {
            upvotes: { increment: voteType === 'up' ? 1 : -1 },
            downvotes: { increment: voteType === 'down' ? 1 : -1 },
          },
        });

        return {
          upvotes: updatedReview.upvotes,
          downvotes: updatedReview.downvotes,
          userVote: voteType,
        };
      }

      await tx.reviewVote.create({
        data: {
          studentId,
          reviewId,
          voteType,
        },
      });

      const updatedReview = await tx.review.update({
        where: { id: reviewId },
        data: voteType === 'up'
          ? { upvotes: { increment: 1 } }
          : { downvotes: { increment: 1 } },
      });

      return {
        upvotes: updatedReview.upvotes,
        downvotes: updatedReview.downvotes,
        userVote: voteType,
      };
    });

    if (!result) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  } finally {
    if (acquiredLock && lockKey) {
      votesInFlight.delete(lockKey);
    }
  }
}; 