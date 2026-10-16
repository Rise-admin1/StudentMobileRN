import prisma from '../lib/prisma.js';
import { acceptRefundRequest, declineRefundRequest } from '../services/refundService.js';
import { performAccountDeletion } from '../services/accountDeletionService.js';
import { formatClassStart, formatPurchaseAmount } from '../utils/refundEligibility.js';

const parsePaging = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 50, 1), 50);
  return { page, pageSize, skip: (page - 1) * pageSize };
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      teachers,
      students,
      parents,
      organizations,
      pendingSubjects,
      confirmedPurchases,
      spendAgg,
      pendingRefundRequests,
      pendingDeletionRequests,
    ] = await Promise.all([
      prisma.user.count({ where: { userType: 'TEACHER' } }),
      prisma.user.count({ where: { userType: 'STUDENT' } }),
      prisma.user.count({ where: { userType: 'PARENT' } }),
      prisma.organization.count(),
      prisma.subject.count({
        where: { subjectVerification: false, rejectedAt: null },
      }),
      prisma.stripePurchases.count({ where: { purchaseStatus: 'CONFIRMED' } }),
      prisma.stripePurchases.aggregate({
        where: { purchaseStatus: 'CONFIRMED' },
        _sum: { purchaseAmount: true },
      }),
      prisma.refundRequest.count({ where: { status: 'PENDING' } }),
      prisma.accountDeletionRequest.count({ where: { status: 'PENDING' } }),
    ]);

    return res.status(200).json({
      teachers,
      students,
      parents,
      organizations,
      pendingSubjects,
      confirmedPurchases,
      pendingRefundRequests,
      pendingDeletionRequests,
      totalSpendMinor: spendAgg._sum.purchaseAmount || 0,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminTeachers = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      userType: 'TEACHER',
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          teacherProfile: {
            select: {
              organizationRole: true,
              organization: {
                select: { orgName: true },
              },
              subjects: {
                select: {
                  subjectVerification: true,
                  rejectedAt: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const teachers = users.map((user) => {
      const subjects = user.teacherProfile?.subjects || [];
      const verifiedSubjects = subjects.filter((s) => s.subjectVerification).length;
      const rejectedSubjects = subjects.filter((s) => Boolean(s.rejectedAt)).length;
      const pendingSubjects = subjects.filter(
        (s) => !s.subjectVerification && !s.rejectedAt
      ).length;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        organizationName: user.teacherProfile?.organization?.orgName || null,
        organizationRole: user.teacherProfile?.organizationRole || null,
        verifiedSubjects,
        pendingSubjects,
        rejectedSubjects,
      };
    });

    return res.status(200).json({ page, pageSize, total, teachers });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminOrganizations = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = q
      ? {
          OR: [
            { orgName: { contains: q } },
            { orgEmail: { contains: q } },
          ],
        }
      : {};

    const [total, organizations] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orgName: true,
          orgEmail: true,
          orgWebsite: true,
          orgCapacity: true,
          createdAt: true,
          teamLead: {
            select: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          _count: {
            select: { members: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      organizations: organizations.map((org) => ({
        id: org.id,
        orgName: org.orgName,
        orgEmail: org.orgEmail,
        orgWebsite: org.orgWebsite,
        orgCapacity: org.orgCapacity,
        memberCount: org._count.members,
        teamLeadName: org.teamLead?.user?.name || null,
        teamLeadEmail: org.teamLead?.user?.email || null,
        createdAt: org.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminParents = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      userType: 'PARENT',
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          parentProfile: {
            select: {
              links: {
                select: { status: true },
              },
            },
          },
        },
      }),
    ]);

    const parents = users.map((user) => {
      const links = user.parentProfile?.links || [];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        acceptedLinks: links.filter((l) => l.status === 'ACCEPTED').length,
        pendingLinks: links.filter((l) => l.status === 'PENDING').length,
      };
    });

    return res.status(200).json({ page, pageSize, total, parents });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminPurchases = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      purchaseStatus: 'CONFIRMED',
      ...(q
        ? {
            OR: [
              { student: { user: { name: { contains: q } } } },
              { student: { user: { email: { contains: q } } } },
              { subject: { subjectName: { contains: q } } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.stripePurchases.count({ where }),
      prisma.stripePurchases.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { purchaseDate: 'desc' },
        select: {
          id: true,
          purchaseAmount: true,
          purchaseCurrency: true,
          purchaseDate: true,
          purchaseReceiptUrl: true,
          student: {
            select: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          subject: {
            select: { subjectName: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      purchases: rows.map((row) => ({
        id: row.id,
        studentName: row.student?.user?.name || null,
        studentEmail: row.student?.user?.email || null,
        subjectName: row.subject?.subjectName || null,
        purchaseAmount: row.purchaseAmount,
        purchaseCurrency: row.purchaseCurrency,
        purchaseDate: row.purchaseDate,
        purchaseReceiptUrl: row.purchaseReceiptUrl,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminRefundRequests = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim().toUpperCase() : 'PENDING';
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { reason: { contains: q } },
              { student: { user: { name: { contains: q } } } },
              { student: { user: { email: { contains: q } } } },
              { purchase: { subject: { subjectName: { contains: q } } } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.refundRequest.count({ where }),
      prisma.refundRequest.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          reason: true,
          classStartsAt: true,
          createdAt: true,
          reviewedAt: true,
          adminNote: true,
          student: {
            select: {
              user: { select: { name: true, email: true } },
            },
          },
          purchase: {
            select: {
              id: true,
              purchaseAmount: true,
              purchaseCurrency: true,
              purchaseDate: true,
              paymentStatus: true,
              subject: {
                select: {
                  subjectName: true,
                  courseType: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      refundRequests: rows.map((row) => ({
        id: row.id,
        status: row.status,
        reason: row.reason,
        classStartsAt: row.classStartsAt,
        classStartsAtLabel: formatClassStart(row.classStartsAt),
        createdAt: row.createdAt,
        reviewedAt: row.reviewedAt,
        adminNote: row.adminNote,
        studentName: row.student?.user?.name || null,
        studentEmail: row.student?.user?.email || null,
        purchaseId: row.purchase?.id || null,
        subjectName: row.purchase?.subject?.subjectName || null,
        courseType: row.purchase?.subject?.courseType || null,
        purchaseAmount: row.purchase?.purchaseAmount || 0,
        purchaseCurrency: row.purchase?.purchaseCurrency || 'aed',
        purchaseAmountLabel: formatPurchaseAmount(
          row.purchase?.purchaseAmount || 0,
          row.purchase?.purchaseCurrency || 'aed'
        ),
        purchaseDate: row.purchase?.purchaseDate || null,
        paymentStatus: row.purchase?.paymentStatus || null,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const acceptAdminRefundRequest = async (req, res, next) => {
  try {
    const refundRequest = await acceptRefundRequest({
      refundRequestId: req.params.refundRequestId,
      adminUserId: req.userId,
      adminNote: req.body?.adminNote,
    });
    return res.status(200).json({
      message: 'Refund request accepted',
      refundRequest,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export const declineAdminRefundRequest = async (req, res, next) => {
  try {
    const refundRequest = await declineRefundRequest({
      refundRequestId: req.params.refundRequestId,
      adminUserId: req.userId,
      adminNote: req.body?.adminNote,
    });
    return res.status(200).json({
      message: 'Refund request declined',
      refundRequest,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export const getAdminDeletionRequests = async (req, res, next) => {
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim().toUpperCase() : 'PENDING';
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { userName: { contains: q } },
              { userEmail: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.accountDeletionRequest.count({ where }),
      prisma.accountDeletionRequest.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          userId: true,
          userName: true,
          userEmail: true,
          userType: true,
          createdAt: true,
          reviewedAt: true,
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      deletionRequests: rows,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const approveAdminDeletionRequest = async (req, res, next) => {
  try {
    const { deletionRequestId } = req.params;
    const adminUserId = req.userId;

    const deletionRequest = await prisma.accountDeletionRequest.findUnique({
      where: { id: deletionRequestId },
    });
    if (!deletionRequest) {
      return res.status(404).json({ message: 'Deletion request not found' });
    }
    if (deletionRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'This deletion request has already been processed' });
    }
    if (!deletionRequest.userId) {
      return res.status(404).json({ message: 'User not found for this deletion request' });
    }
    if (deletionRequest.userId === adminUserId) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await prisma.user.findUnique({
      where: { id: deletionRequest.userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.accountDeletionRequest.update({
      where: { id: deletionRequest.id },
      data: {
        status: 'COMPLETED',
        reviewedById: adminUserId,
        reviewedAt: new Date(),
      },
    });

    await performAccountDeletion(user);

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const subjectAdminStatus = (subject) => {
  if (subject.subjectVerification) return 'verified';
  if (subject.rejectedAt) return 'rejected';
  return 'pending';
};

const mapAdminReport = (report) => ({
  id: report.id,
  reportDescription: report.reportDescription,
  reportStatus: report.reportStatus,
  reportResolution: report.reportResolution,
  createdAt: report.createdAt,
  reporterId: report.reporterId,
  reporterName: report.reporter?.name || null,
  reporterEmail: report.reporter?.email || null,
  subjectId: report.subjectId,
  subjectName: report.reportedSubject?.subjectName || null,
  teacherName: report.reportedSubject?.teacherProfile?.user?.name || null,
  teacherEmail: report.reportedSubject?.teacherProfile?.user?.email || null,
});

const adminReportInclude = {
  reporter: {
    select: { id: true, name: true, email: true },
  },
  reportedSubject: {
    select: {
      id: true,
      subjectName: true,
      teacherProfile: {
        select: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  },
};

export const getAdminTeacherDetail = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        userDescription: true,
        verified: true,
        lastSeenAt: true,
        createdAt: true,
        userType: true,
        teacherProfile: {
          select: {
            id: true,
            zoomAccountCreated: true,
            zoomUserAcceptedInvite: true,
            isTeamLead: true,
            organizationRole: true,
            organization: {
              select: { id: true, orgName: true, orgEmail: true },
            },
            subjects: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                subjectName: true,
                subjectBoard: true,
                subjectGrade: true,
                subjectPrice: true,
                subjectVerification: true,
                rejectedAt: true,
                rejectionReason: true,
                createdAt: true,
                submittedForVerificationAt: true,
                courseType: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.userType !== 'TEACHER' || !user.teacherProfile) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      userDescription: user.userDescription,
      verified: user.verified,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      teacherProfile: {
        id: user.teacherProfile.id,
        zoomAccountCreated: user.teacherProfile.zoomAccountCreated,
        zoomUserAcceptedInvite: user.teacherProfile.zoomUserAcceptedInvite,
        isTeamLead: user.teacherProfile.isTeamLead,
        organizationRole: user.teacherProfile.organizationRole,
        organization: user.teacherProfile.organization,
      },
      subjects: user.teacherProfile.subjects.map((subject) => ({
        ...subject,
        status: subjectAdminStatus(subject),
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminParentDetail = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        userType: true,
        parentProfile: {
          select: {
            links: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                status: true,
                createdAt: true,
                respondedAt: true,
                student: {
                  select: {
                    id: true,
                    userId: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.userType !== 'PARENT' || !user.parentProfile) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      links: user.parentProfile.links.map((link) => ({
        id: link.id,
        status: link.status,
        createdAt: link.createdAt,
        respondedAt: link.respondedAt,
        student: {
          id: link.student.id,
          userId: link.student.userId,
          name: link.student.user?.name || null,
          email: link.student.user?.email || null,
          profileImage: link.student.user?.profileImage || null,
        },
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminOrganizationDetail = async (req, res, next) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.params.organizationId },
      select: {
        id: true,
        orgName: true,
        orgEmail: true,
        orgWebsite: true,
        orgLicense: true,
        orgCapacity: true,
        createdAt: true,
        updatedAt: true,
        teamLead: {
          select: {
            organizationRole: true,
            user: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
        },
        members: {
          select: {
            organizationRole: true,
            user: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const teamLeadId = organization.teamLead?.user?.id || null;
    const teamLead = organization.teamLead?.user
      ? {
          id: organization.teamLead.user.id,
          name: organization.teamLead.user.name,
          email: organization.teamLead.user.email,
          profileImage: organization.teamLead.user.profileImage,
          organizationRole: organization.teamLead.organizationRole || 'OWNER',
        }
      : null;

    const regularMembers = organization.members
      .filter((member) => member.user.id !== teamLeadId)
      .map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        profileImage: member.user.profileImage,
        organizationRole: member.organizationRole || null,
        isTeamLead: false,
      }));

    const members = [
      ...(teamLead
        ? [
            {
              ...teamLead,
              isTeamLead: true,
            },
          ]
        : []),
      ...regularMembers,
    ];

    return res.status(200).json({
      id: organization.id,
      orgName: organization.orgName,
      orgEmail: organization.orgEmail,
      orgWebsite: organization.orgWebsite,
      orgLicense: organization.orgLicense,
      orgCapacity: organization.orgCapacity,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      teamLead,
      members,
      memberCount: members.length,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminPurchaseDetail = async (req, res, next) => {
  try {
    const purchase = await prisma.stripePurchases.findUnique({
      where: { id: req.params.purchaseId },
      select: {
        id: true,
        purchaseAmount: true,
        purchaseCurrency: true,
        purchaseDate: true,
        purchaseStatus: true,
        paymentStatus: true,
        purchaseReceiptUrl: true,
        stripeCustomerId: true,
        stripeChargeId: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            userId: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        subject: {
          select: {
            id: true,
            subjectName: true,
            courseType: true,
            subjectBoard: true,
            subjectGrade: true,
            subjectPrice: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingStatus: true,
            bookingDate: true,
            bookingTime: true,
            bookingHours: true,
            bookingMinutes: true,
            bookingZoomUrl: true,
            subjectTopicId: true,
            createdAt: true,
          },
        },
        courseEnrollment: {
          select: {
            id: true,
            enrollmentStatus: true,
            enrolledAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    return res.status(200).json({
      id: purchase.id,
      purchaseAmount: purchase.purchaseAmount,
      purchaseCurrency: purchase.purchaseCurrency,
      purchaseDate: purchase.purchaseDate,
      purchaseStatus: purchase.purchaseStatus,
      paymentStatus: purchase.paymentStatus,
      purchaseReceiptUrl: purchase.purchaseReceiptUrl,
      stripeCustomerId: purchase.stripeCustomerId,
      stripeChargeId: purchase.stripeChargeId,
      createdAt: purchase.createdAt,
      student: {
        profileId: purchase.student?.id || null,
        userId: purchase.student?.userId || purchase.student?.user?.id || null,
        name: purchase.student?.user?.name || null,
        email: purchase.student?.user?.email || null,
      },
      subject: purchase.subject
        ? {
            id: purchase.subject.id,
            subjectName: purchase.subject.subjectName,
            courseType: purchase.subject.courseType,
            subjectBoard: purchase.subject.subjectBoard,
            subjectGrade: purchase.subject.subjectGrade,
            subjectPrice: purchase.subject.subjectPrice,
          }
        : null,
      booking: purchase.booking
        ? {
            id: purchase.booking.id,
            bookingStatus: purchase.booking.bookingStatus,
            bookingDate: purchase.booking.bookingDate,
            bookingTime: purchase.booking.bookingTime,
            bookingHours: purchase.booking.bookingHours,
            bookingMinutes: purchase.booking.bookingMinutes,
            bookingZoomUrl: purchase.booking.bookingZoomUrl,
            subjectTopicId: purchase.booking.subjectTopicId,
            createdAt: purchase.booking.createdAt,
          }
        : null,
      courseEnrollment: purchase.courseEnrollment
        ? {
            id: purchase.courseEnrollment.id,
            enrollmentStatus: purchase.courseEnrollment.enrollmentStatus,
            enrolledAt: purchase.courseEnrollment.enrolledAt,
            createdAt: purchase.courseEnrollment.createdAt,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminReportDetail = async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.reportId },
      include: adminReportInclude,
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json(mapAdminReport(report));
  } catch (err) {
    console.error(err);
    next(err);
  }
};
