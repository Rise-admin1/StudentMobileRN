import { PrismaClient } from '@prisma/client';
import { acceptRefundRequest, declineRefundRequest } from '../services/refundService.js';
import { performAccountDeletion } from '../services/accountDeletionService.js';
import { formatClassStart, formatPurchaseAmount } from '../utils/refundEligibility.js';

const prisma = new PrismaClient();

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
