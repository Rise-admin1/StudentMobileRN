import { BookingStatus, EnrollmentStatus, PaymentStatus, RefundRequestStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import Stripe from 'stripe';
import { canRequestRefund, earliestUpcomingStart } from '../utils/refundEligibility.js';
import {
  sendRefundAcceptedEmails,
  sendRefundDeclinedEmails,
  sendRefundSubmittedEmails,
} from '../utils/refundEmails.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const purchaseRefundInclude = {
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
  subject: {
    select: {
      id: true,
      subjectName: true,
      courseType: true,
      scheduledDateTime: true,
      currentEnrollment: true,
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
  student: {
    select: {
      id: true,
      user: { select: { email: true, name: true } },
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
};

async function loadPackageBookings(purchase) {
  if (purchase.subject?.courseType !== 'SINGLE_PACKAGE') return [];
  return prisma.booking.findMany({
    where: {
      studentId: purchase.studentId,
      subjectId: purchase.subjectId,
      bookingStatus: BookingStatus.CONFIRMED,
    },
    select: {
      id: true,
      bookingDate: true,
      bookingTime: true,
      bookingStatus: true,
    },
  });
}

export async function getPurchaseRefundContext(purchase, now = new Date()) {
  const packageBookings = await loadPackageBookings(purchase);
  const classStartsAt = earliestUpcomingStart({
    courseType: purchase.subject?.courseType,
    booking: purchase.booking,
    packageBookings,
    subject: purchase.subject,
    now,
  });
  const pendingRequest = (purchase.refundRequests || []).find((request) => request.status === RefundRequestStatus.PENDING);
  const latestRequest = (purchase.refundRequests || [])[0] || null;
  const refundEligible = canRequestRefund({
    paymentStatus: purchase.paymentStatus,
    purchaseStatus: purchase.purchaseStatus,
    hasPendingRequest: Boolean(pendingRequest),
    classStartsAt,
    now,
  });

  return {
    packageBookings,
    classStartsAt,
    pendingRequest,
    latestRequest,
    refundEligible,
  };
}

export function mapPurchaseForBilling(purchase, context, { canSubmit = false } = {}) {
  return {
    id: purchase.id,
    subjectName: purchase.subject?.subjectName || 'Course',
    purchaseAmount: purchase.purchaseAmount,
    purchaseCurrency: purchase.purchaseCurrency,
    purchaseDate: purchase.purchaseDate,
    purchaseReceiptUrl: purchase.purchaseReceiptUrl || null,
    paymentStatus: purchase.paymentStatus,
    purchaseStatus: purchase.purchaseStatus,
    refundEligible: canSubmit ? context.refundEligible : false,
    refundRequestStatus: context.pendingRequest?.status || context.latestRequest?.status || null,
    refundReason: context.pendingRequest?.reason || context.latestRequest?.reason || null,
    classStartsAt: context.classStartsAt,
  };
}

export async function createRefundRequest({ purchaseId, studentProfileId, reason, requestedBy }) {
  const trimmedReason = String(reason || '').trim();
  if (!trimmedReason) {
    const error = new Error('A refund reason is required');
    error.statusCode = 400;
    throw error;
  }

  const purchase = await prisma.stripePurchases.findFirst({
    where: {
      id: purchaseId,
      studentId: studentProfileId,
    },
    include: purchaseRefundInclude,
  });

  if (!purchase) {
    const error = new Error('Purchase not found');
    error.statusCode = 404;
    throw error;
  }

  const context = await getPurchaseRefundContext(purchase);
  if (!context.refundEligible || !context.classStartsAt) {
    const error = new Error('This purchase is not eligible for a refund request');
    error.statusCode = 400;
    throw error;
  }

  const refundRequest = await prisma.refundRequest.create({
    data: {
      purchaseId: purchase.id,
      studentId: studentProfileId,
      status: RefundRequestStatus.PENDING,
      reason: trimmedReason,
      classStartsAt: context.classStartsAt,
    },
  });

  const emailDetails = {
    studentName: purchase.student?.user?.name || 'Student',
    studentEmail: purchase.student?.user?.email,
    subjectName: purchase.subject?.subjectName || 'Course',
    purchaseAmount: purchase.purchaseAmount,
    purchaseCurrency: purchase.purchaseCurrency,
    classStartsAt: context.classStartsAt,
    reason: trimmedReason,
    requestedByRole: requestedBy?.role || 'STUDENT',
    requestedByName: requestedBy?.name || null,
    requestedByEmail: requestedBy?.email || null,
  };
  await sendRefundSubmittedEmails(prisma, emailDetails);

  return refundRequest;
}

async function resolveStripeChargeId(purchase) {
  if (purchase.stripeChargeId) return purchase.stripeChargeId;
  if (!purchase.stripeCustomerId) {
    const error = new Error('Stripe charge could not be found for this purchase');
    error.statusCode = 400;
    throw error;
  }

  const charges = await stripe.charges.list({
    customer: purchase.stripeCustomerId,
    limit: 100,
  });
  const purchaseTime = new Date(purchase.purchaseDate).getTime();
  const matches = (charges.data || [])
    .filter((charge) => charge.amount === purchase.purchaseAmount && charge.paid && !charge.refunded)
    .map((charge) => ({
      charge,
      distance: Math.abs((charge.created * 1000) - purchaseTime),
    }))
    .sort((a, b) => a.distance - b.distance);

  const best = matches[0]?.charge;
  if (!best?.id) {
    const error = new Error('Stripe charge could not be found for this purchase');
    error.statusCode = 400;
    throw error;
  }

  await prisma.stripePurchases.update({
    where: { id: purchase.id },
    data: { stripeChargeId: best.id },
  });
  return best.id;
}

async function cancelPurchaseRecords(tx, purchase, packageBookings) {
  const courseType = purchase.subject?.courseType;

  await tx.stripePurchases.update({
    where: { id: purchase.id },
    data: {
      paymentStatus: PaymentStatus.REFUNDED,
      purchaseStatus: BookingStatus.CANCELLED,
    },
  });

  if (courseType === 'SINGLE_STUDENT' && purchase.bookingId) {
    await tx.booking.updateMany({
      where: {
        id: purchase.bookingId,
        bookingStatus: BookingStatus.CONFIRMED,
      },
      data: { bookingStatus: BookingStatus.CANCELLED },
    });
  }

  if (courseType === 'SINGLE_PACKAGE') {
    const bookingIds = (packageBookings || []).map((booking) => booking.id);
    if (bookingIds.length) {
      await tx.booking.updateMany({
        where: {
          id: { in: bookingIds },
          bookingStatus: BookingStatus.CONFIRMED,
        },
        data: { bookingStatus: BookingStatus.CANCELLED },
      });
    }
  }

  if ((courseType === 'MULTI_STUDENT' || courseType === 'MULTI_PACKAGE') && purchase.courseEnrollmentId) {
    const enrollment = await tx.courseEnrollment.findUnique({
      where: { id: purchase.courseEnrollmentId },
    });
    if (enrollment && enrollment.enrollmentStatus !== EnrollmentStatus.CANCELLED) {
      await tx.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { enrollmentStatus: EnrollmentStatus.CANCELLED },
      });
      if (enrollment.enrollmentStatus === EnrollmentStatus.CONFIRMED) {
        const subject = await tx.subject.findUnique({
          where: { id: purchase.subjectId },
          select: { currentEnrollment: true },
        });
        const nextCount = Math.max(0, (subject?.currentEnrollment || 0) - 1);
        await tx.subject.update({
          where: { id: purchase.subjectId },
          data: { currentEnrollment: nextCount },
        });
      }
    }
  }

  await tx.userSubject.deleteMany({
    where: {
      studentId: purchase.studentId,
      subjectId: purchase.subjectId,
    },
  });
}

export async function acceptRefundRequest({ refundRequestId, adminUserId, adminNote }) {
  const refundRequest = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: {
      purchase: {
        include: purchaseRefundInclude,
      },
    },
  });

  if (!refundRequest) {
    const error = new Error('Refund request not found');
    error.statusCode = 404;
    throw error;
  }
  if (refundRequest.status !== RefundRequestStatus.PENDING) {
    const error = new Error('Only pending refund requests can be accepted');
    error.statusCode = 400;
    throw error;
  }

  const purchase = refundRequest.purchase;
  const context = await getPurchaseRefundContext(purchase);
  const chargeId = await resolveStripeChargeId(purchase);

  await stripe.refunds.create({
    charge: chargeId,
    reason: 'requested_by_customer',
  });

  const note = String(adminNote || '').trim() || null;
  const updated = await prisma.$transaction(async (tx) => {
    await cancelPurchaseRecords(tx, purchase, context.packageBookings);
    return tx.refundRequest.update({
      where: { id: refundRequest.id },
      data: {
        status: RefundRequestStatus.ACCEPTED,
        adminNote: note,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
      },
    });
  });

  await sendRefundAcceptedEmails(prisma, {
    studentName: purchase.student?.user?.name || 'Student',
    studentEmail: purchase.student?.user?.email,
    teacherEmail: purchase.subject?.teacherProfile?.user?.email,
    subjectName: purchase.subject?.subjectName || 'Course',
    purchaseAmount: purchase.purchaseAmount,
    purchaseCurrency: purchase.purchaseCurrency,
    classStartsAt: refundRequest.classStartsAt,
    reason: refundRequest.reason,
  });

  return updated;
}

export async function declineRefundRequest({ refundRequestId, adminUserId, adminNote }) {
  const refundRequest = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: {
      purchase: {
        include: purchaseRefundInclude,
      },
    },
  });

  if (!refundRequest) {
    const error = new Error('Refund request not found');
    error.statusCode = 404;
    throw error;
  }
  if (refundRequest.status !== RefundRequestStatus.PENDING) {
    const error = new Error('Only pending refund requests can be declined');
    error.statusCode = 400;
    throw error;
  }

  const note = String(adminNote || '').trim() || null;
  const updated = await prisma.refundRequest.update({
    where: { id: refundRequest.id },
    data: {
      status: RefundRequestStatus.DECLINED,
      adminNote: note,
      reviewedById: adminUserId,
      reviewedAt: new Date(),
    },
  });

  const purchase = refundRequest.purchase;
  await sendRefundDeclinedEmails(prisma, {
    studentName: purchase.student?.user?.name || 'Student',
    studentEmail: purchase.student?.user?.email,
    subjectName: purchase.subject?.subjectName || 'Course',
    purchaseAmount: purchase.purchaseAmount,
    purchaseCurrency: purchase.purchaseCurrency,
    classStartsAt: refundRequest.classStartsAt,
    reason: refundRequest.reason,
    adminNote: note,
  });

  return updated;
}

export { purchaseRefundInclude };
