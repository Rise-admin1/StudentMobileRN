import prisma from "../lib/prisma.js";

const voteKey = (studentId, reviewId) => ({
  studentId_reviewId: {
    studentId,
    reviewId,
  },
});

const isRetryableVoteError = (err) =>
  err?.code === "P2002" || err?.code === "P2025" || err?.code === "P2034";

const saveReviewVote = async (tx, studentId, reviewId, voteType) => {
  await tx.$queryRaw`SELECT id FROM Review WHERE id = ${reviewId} FOR UPDATE`;

  const review = await tx.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return null;
  }

  const existingVote = await tx.reviewVote.findUnique({
    where: voteKey(studentId, reviewId),
  });
  const currentVote = existingVote?.voteType ?? null;

  if (currentVote === voteType) {
    return {
      upvotes: review.upvotes,
      downvotes: review.downvotes,
      userVote: currentVote,
    };
  }

  if (voteType === null) {
    await tx.reviewVote.delete({
      where: voteKey(studentId, reviewId),
    });

    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: currentVote === "up"
        ? { upvotes: { decrement: 1 } }
        : { downvotes: { decrement: 1 } },
    });

    return {
      upvotes: updatedReview.upvotes,
      downvotes: updatedReview.downvotes,
      userVote: null,
    };
  }

  if (!existingVote) {
    await tx.reviewVote.create({
      data: {
        studentId,
        reviewId,
        voteType,
      },
    });

    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: voteType === "up"
        ? { upvotes: { increment: 1 } }
        : { downvotes: { increment: 1 } },
    });

    return {
      upvotes: updatedReview.upvotes,
      downvotes: updatedReview.downvotes,
      userVote: voteType,
    };
  }

  await tx.reviewVote.update({
    where: voteKey(studentId, reviewId),
    data: { voteType },
  });

  const updatedReview = await tx.review.update({
    where: { id: reviewId },
    data: {
      upvotes: { increment: voteType === "up" ? 1 : -1 },
      downvotes: { increment: voteType === "down" ? 1 : -1 },
    },
  });

  return {
    upvotes: updatedReview.upvotes,
    downvotes: updatedReview.downvotes,
    userVote: voteType,
  };
};

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
  const { voteType } = req.body ?? {};
  const userId = req.userId;

  try {
    if (voteType !== "up" && voteType !== "down" && voteType !== null) {
      return res.status(400).json({ message: "Vote must be up, down, or null" });
    }

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
    let result = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        result = await prisma.$transaction((tx) =>
          saveReviewVote(tx, studentId, reviewId, voteType)
        );
        break;
      } catch (err) {
        if (!isRetryableVoteError(err) || attempt === 2) {
          throw err;
        }
      }
    }

    if (!result) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}; 