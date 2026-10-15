import { bookingDateStr, fromUaeDateTime, toUaeParts } from './uaeDateTime.js';

export const REFUND_LEAD_MS = 2 * 24 * 60 * 60 * 1000;

export function sessionStartFromBooking(booking) {
  if (!booking?.bookingDate || !booking?.bookingTime) return null;
  const dateStr = bookingDateStr(booking.bookingDate);
  if (!dateStr) return null;
  const start = fromUaeDateTime(dateStr, booking.bookingTime);
  return Number.isNaN(start.getTime()) ? null : start;
}

function pushStart(starts, value) {
  if (!value) return;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isNaN(date.getTime())) starts.push(date);
}

export function earliestUpcomingStart({ courseType, booking, packageBookings, subject, now }) {
  const starts = [];
  if (courseType === 'SINGLE_STUDENT') {
    pushStart(starts, sessionStartFromBooking(booking));
  } else if (courseType === 'MULTI_STUDENT') {
    pushStart(starts, subject?.scheduledDateTime);
  } else if (courseType === 'SINGLE_PACKAGE') {
    for (const packageBooking of packageBookings || []) {
      pushStart(starts, sessionStartFromBooking(packageBooking));
    }
  } else if (courseType === 'MULTI_PACKAGE') {
    for (const topic of subject?.subjectTopics || []) {
      pushStart(starts, topic.scheduledAt);
    }
  }

  const upcoming = starts
    .filter((start) => start.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime());
  return upcoming[0] || null;
}

export function canRequestRefund({ paymentStatus, purchaseStatus, hasPendingRequest, classStartsAt, now }) {
  if (paymentStatus !== 'COMPLETE') return false;
  if (purchaseStatus !== 'CONFIRMED') return false;
  if (hasPendingRequest) return false;
  if (!classStartsAt) return false;
  return classStartsAt.getTime() >= now.getTime() + REFUND_LEAD_MS;
}

export function formatClassStart(date) {
  if (!date) return '';
  const parts = toUaeParts(date);
  return `${parts.dateStr} ${parts.timeStr} (UAE)`;
}

export function formatPurchaseAmount(amount, currency) {
  const value = ((amount || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${(currency || 'AED').toUpperCase()} ${value}`;
}
