import prisma from '../lib/prisma.js';
import {
  createRefundRequest,
  getPurchaseRefundContext,
  mapPurchaseForBilling,
} from '../services/refundService.js';

const billingPurchaseSelect = {
  id: true,
  purchaseAmount: true,
  purchaseCurrency: true,
  purchaseDate: true,
  purchaseReceiptUrl: true,
  purchaseStatus: true,
  paymentStatus: true,
  studentId: true,
  subjectId: true,
  bookingId: true,
  courseEnrollmentId: true,
  stripeChargeId: true,
  stripeCustomerId: true,
  subject: {
    select: {
      id: true,
      subjectName: true,
      courseType: true,
      scheduledDateTime: true,
      teacherId: true,
      teacherProfile: {
        select: {
          user: { select: { email: true, name: true } },
        },
      },
      subjectTopics: {
        select: {
          id: true,
          scheduledAt: true,
        },
        orderBy: { orderIndex: 'asc' },
      },
    },
  },
  booking: {
    select: {
      id: true,
      bookingDate: true,
      bookingTime: true,
      bookingStatus: true,
    },
  },
  courseEnrollment: {
    select: {
      id: true,
      enrollmentStatus: true,
    },
  },
  refundRequests: {
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      reason: true,
      classStartsAt: true,
      createdAt: true,
      reviewedAt: true,
    },
  },
  student: {
    select: {
      id: true,
      user: { select: { email: true, name: true } },
    },
  },
};

async function mapPurchases(rows, { canSubmit }) {
  const mapped = [];
  for (const row of rows) {
    const context = await getPurchaseRefundContext(row);
    mapped.push(mapPurchaseForBilling(row, context, { canSubmit }));
  }
  return mapped;
}

export const getBilling = async (req, res, next) => {
  try {
    if (req.userType === 'STUDENT') {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { studentProfile: { select: { id: true } } },
      });
      if (!user?.studentProfile) {
        return res.status(400).json({ message: 'Student profile not found' });
      }

      const rows = await prisma.stripePurchases.findMany({
        where: {
          studentId: user.studentProfile.id,
          purchaseStatus: { in: ['CONFIRMED', 'CANCELLED'] },
        },
        orderBy: { purchaseDate: 'desc' },
        select: billingPurchaseSelect,
      });

      return res.status(200).json({
        role: 'STUDENT',
        purchases: await mapPurchases(rows, { canSubmit: true }),
      });
    }

    if (req.userType === 'PARENT') {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { parentProfile: { select: { id: true } } },
      });
      if (!user?.parentProfile) {
        return res.status(400).json({ message: 'Parent profile not found' });
      }

      const links = await prisma.parentStudentLink.findMany({
        where: {
          parentProfileId: user.parentProfile.id,
          status: 'ACCEPTED',
        },
        orderBy: { createdAt: 'asc' },
        select: {
          student: {
            select: {
              id: true,
              user: { select: { name: true } },
              stripePurchases: {
                where: { purchaseStatus: { in: ['CONFIRMED', 'CANCELLED'] } },
                orderBy: { purchaseDate: 'desc' },
                select: billingPurchaseSelect,
              },
            },
          },
        },
      });

      const students = [];
      for (const link of links) {
        students.push({
          studentProfileId: link.student.id,
          studentName: link.student.user?.name || 'Student',
          purchases: await mapPurchases(link.student.stripePurchases || [], { canSubmit: true }),
        });
      }

      return res.status(200).json({
        role: 'PARENT',
        students,
      });
    }

    return res.status(403).json({ message: 'Billing is not available for this account' });
  } catch (err) {
    next(err);
  }
};

export const requestPurchaseRefund = async (req, res, next) => {
  try {
    if (req.userType === 'STUDENT') {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          name: true,
          email: true,
          studentProfile: { select: { id: true } },
        },
      });
      if (!user?.studentProfile) {
        return res.status(400).json({ message: 'Student profile not found' });
      }

      const refundRequest = await createRefundRequest({
        purchaseId: req.params.purchaseId,
        studentProfileId: user.studentProfile.id,
        reason: req.body?.reason,
        requestedBy: {
          role: 'STUDENT',
          name: user.name,
          email: user.email,
        },
      });

      return res.status(201).json({
        message: 'Refund request submitted',
        refundRequest,
      });
    }

    if (req.userType === 'PARENT') {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          name: true,
          email: true,
          parentProfile: { select: { id: true } },
        },
      });
      if (!user?.parentProfile) {
        return res.status(400).json({ message: 'Parent profile not found' });
      }

      const purchase = await prisma.stripePurchases.findUnique({
        where: { id: req.params.purchaseId },
        select: { id: true, studentId: true },
      });
      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }

      const link = await prisma.parentStudentLink.findFirst({
        where: {
          parentProfileId: user.parentProfile.id,
          studentProfileId: purchase.studentId,
          status: 'ACCEPTED',
        },
        select: { id: true },
      });
      if (!link) {
        return res.status(403).json({ message: 'You can only request refunds for linked students' });
      }

      const refundRequest = await createRefundRequest({
        purchaseId: purchase.id,
        studentProfileId: purchase.studentId,
        reason: req.body?.reason,
        requestedBy: {
          role: 'PARENT',
          name: user.name,
          email: user.email,
        },
      });

      return res.status(201).json({
        message: 'Refund request submitted',
        refundRequest,
      });
    }

    return res.status(403).json({ message: 'You are not allowed to request a refund' });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};
