import { PrismaClient, BookingStatus, EnrollmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const ratingInclude = {
  teacher: {
    include: {
      user: {
        select: {
          name: true,
          profileImage: true,
        },
      },
    },
  },
};

async function findStudentByUserId(studentUserId) {
  const studentUser = await prisma.user.findUnique({
    where: { id: studentUserId },
    include: {
      studentProfile: { select: { id: true } },
    },
  });

  if (!studentUser?.studentProfile) {
    return null;
  }

  return {
    userId: studentUser.id,
    name: studentUser.name,
    profileId: studentUser.studentProfile.id,
  };
}

async function teacherHasTaught(teacherProfileId, studentProfileId) {
  const [booking, enrollment] = await Promise.all([
    prisma.booking.findFirst({
      where: {
        teacherId: teacherProfileId,
        studentId: studentProfileId,
        bookingStatus: BookingStatus.CONFIRMED,
      },
      select: { id: true },
    }),
    prisma.courseEnrollment.findFirst({
      where: {
        studentId: studentProfileId,
        enrollmentStatus: EnrollmentStatus.CONFIRMED,
        subject: { teacherId: teacherProfileId },
      },
      select: { id: true },
    }),
  ]);

  return Boolean(booking || enrollment);
}

async function getViewerAccess(userId, studentProfileId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacherProfile: { select: { id: true } },
      studentProfile: { select: { id: true } },
      parentProfile: { select: { id: true } },
    },
  });

  if (!user) {
    return null;
  }

  if (user.studentProfile?.id === studentProfileId) {
    return { canRate: false, teacherProfileId: null };
  }

  if (user.teacherProfile && await teacherHasTaught(user.teacherProfile.id, studentProfileId)) {
    return { canRate: true, teacherProfileId: user.teacherProfile.id };
  }

  if (user.parentProfile) {
    const link = await prisma.parentStudentLink.findFirst({
      where: {
        parentProfileId: user.parentProfile.id,
        studentProfileId,
        status: "ACCEPTED",
      },
      select: { id: true },
    });
    if (link) {
      return { canRate: false, teacherProfileId: null };
    }
  }

  return null;
}

function presentRatings(ratings, access) {
  const count = ratings.length;
  const average = count
    ? Math.round((ratings.reduce((sum, rating) => sum + rating.rating, 0) / count) * 10) / 10
    : null;
  const mine = access.teacherProfileId
    ? ratings.find((rating) => rating.teacherId === access.teacherProfileId)
    : null;

  return {
    average,
    count,
    canRate: access.canRate,
    myRating: mine
      ? { rating: mine.rating, description: mine.description }
      : null,
    ratings: ratings.map((rating) => ({
      id: rating.id,
      rating: rating.rating,
      description: rating.description,
      createdAt: rating.createdAt,
      teacher: {
        name: rating.teacher.user.name,
        profileImage: rating.teacher.user.profileImage,
      },
    })),
  };
}

export const getSubjectStudentRatings = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { teacherProfile: { select: { id: true } } },
    });

    if (!user?.teacherProfile) {
      return res.status(403).json({ message: "Only a tutor can rate students" });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { teacherId: true },
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subject.teacherId !== user.teacherProfile.id) {
      return res.status(403).json({ message: "You can only rate students in your own course" });
    }

    const teacherProfileId = user.teacherProfile.id;
    const [bookings, enrollments] = await Promise.all([
      prisma.booking.findMany({
        where: {
          subjectId,
          teacherId: teacherProfileId,
          bookingStatus: BookingStatus.CONFIRMED,
        },
        select: {
          student: {
            select: {
              id: true,
              user: { select: { id: true, name: true, profileImage: true } },
            },
          },
        },
      }),
      prisma.courseEnrollment.findMany({
        where: {
          subjectId,
          enrollmentStatus: EnrollmentStatus.CONFIRMED,
        },
        select: {
          student: {
            select: {
              id: true,
              user: { select: { id: true, name: true, profileImage: true } },
            },
          },
        },
      }),
    ]);

    const studentsByProfile = new Map();
    for (const row of [...bookings, ...enrollments]) {
      if (row.student?.user) {
        studentsByProfile.set(row.student.id, row.student.user);
      }
    }

    const profileIds = [...studentsByProfile.keys()];
    const ratings = profileIds.length
      ? await prisma.studentRating.findMany({
          where: {
            teacherId: teacherProfileId,
            studentId: { in: profileIds },
          },
          select: { studentId: true, rating: true, description: true },
        })
      : [];
    const ratingByStudent = new Map(ratings.map((rating) => [rating.studentId, rating]));

    const students = [...studentsByProfile.entries()]
      .map(([profileId, studentUser]) => {
        const existing = ratingByStudent.get(profileId);
        return {
          studentUserId: studentUser.id,
          name: studentUser.name,
          profileImage: studentUser.profileImage,
          rating: existing?.rating ?? null,
          description: existing?.description ?? "",
        };
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

export const getStudentRatings = async (req, res, next) => {
  try {
    const student = await findStudentByUserId(req.params.studentUserId);
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const access = await getViewerAccess(req.userId, student.profileId);
    if (!access) {
      return res.status(403).json({ message: "You cannot view this student's ratings" });
    }

    const ratings = await prisma.studentRating.findMany({
      where: { studentId: student.profileId },
      include: ratingInclude,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      studentName: student.name,
      ...presentRatings(ratings, access),
    });
  } catch (error) {
    next(error);
  }
};

export const saveStudentRating = async (req, res, next) => {
  try {
    const { studentUserId, description, rating } = req.body;
    const stars = Number(rating);

    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
    }

    const student = await findStudentByUserId(studentUserId);
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const access = await getViewerAccess(req.userId, student.profileId);
    if (!access?.canRate || !access.teacherProfileId) {
      return res.status(403).json({ message: "You can rate a student after you teach them" });
    }

    await prisma.studentRating.upsert({
      where: {
        teacherId_studentId: {
          teacherId: access.teacherProfileId,
          studentId: student.profileId,
        },
      },
      create: {
        description: description.trim(),
        rating: stars,
        teacherId: access.teacherProfileId,
        studentId: student.profileId,
      },
      update: {
        description: description.trim(),
        rating: stars,
      },
    });

    const ratings = await prisma.studentRating.findMany({
      where: { studentId: student.profileId },
      include: ratingInclude,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      studentName: student.name,
      ...presentRatings(ratings, access),
    });
  } catch (error) {
    next(error);
  }
};
