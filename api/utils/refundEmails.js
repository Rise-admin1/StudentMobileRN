import { Resend } from 'resend';
import { ADMIN_CC_EMAIL, BILLING_FROM, OPS_NOTIFY_EMAILS, escHtml } from './opsNotify.js';
import { formatClassStart, formatPurchaseAmount } from './refundEligibility.js';

const resend = new Resend(process.env.COACH_ACADEM_RESEND_API_KEY);

const emailShell = (title, bodyHtml) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background-color: #1A2B4B; padding: 32px 20px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">${escHtml(title)}</h1>
    </div>
    <div style="padding: 32px 20px;">
      ${bodyHtml}
      <p style="color:#1A2B4B;font-size:16px;font-weight:700;margin:24px 0 0;">Coach Academ</p>
    </div>
  </div>
`;

const detailTable = (rows) => {
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;color:#64748B;font-size:13px;border-bottom:1px solid #F1F5F9;">${escHtml(label)}</td><td style="padding:8px 12px;color:#1A2B4B;font-size:14px;border-bottom:1px solid #F1F5F9;">${escHtml(value)}</td></tr>`
    )
    .join('');
  return `<div style="background-color:#F8FAFC;padding:8px 0;border-left:4px solid #1A2B4B;"><table style="width:100%;border-collapse:collapse;">${tableRows}</table></div>`;
};

export async function getRefundAdminEmails(prisma) {
  const admins = await prisma.user.findMany({
    where: { userType: 'ADMIN' },
    select: { email: true },
  });
  const emails = new Set(
    [...admins.map((admin) => admin.email), ...OPS_NOTIFY_EMAILS, ADMIN_CC_EMAIL]
      .map((email) => (email || '').trim().toLowerCase())
      .filter(Boolean)
  );
  return [...emails];
}

async function sendRefundEmail({ to, subject, title, intro, rows }) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return;
  const html = emailShell(
    title,
    `${intro ? `<p style="color:#64748B;font-size:16px;line-height:1.6;">${escHtml(intro)}</p>` : ''}${detailTable(rows)}`
  );
  try {
    await resend.emails.send({
      from: BILLING_FROM,
      to: recipients,
      subject,
      html,
    });
  } catch (err) {
    console.error('Error sending refund email', err);
  }
}

const purchaseRows = (details) => [
  ['Student', details.studentName],
  ['Course', details.subjectName],
  ['Amount', formatPurchaseAmount(details.purchaseAmount, details.purchaseCurrency)],
  ['Class starts', formatClassStart(details.classStartsAt)],
  ['Reason', details.reason],
];

export async function sendRefundSubmittedEmails(prisma, details) {
  const adminEmails = await getRefundAdminEmails(prisma);
  const rows = purchaseRows(details);
  await sendRefundEmail({
    to: details.studentEmail,
    subject: 'Refund request sent',
    title: 'Refund request sent',
    intro: 'Your refund request was sent. An admin will review it.',
    rows,
  });
  await sendRefundEmail({
    to: adminEmails,
    subject: `Refund request to review: ${details.subjectName}`,
    title: 'Please review this refund request',
    intro: 'A student asked for a refund. Review the request in the admin app.',
    rows,
  });
}

export async function sendRefundAcceptedEmails(prisma, details) {
  const adminEmails = await getRefundAdminEmails(prisma);
  const rows = purchaseRows(details);
  await sendRefundEmail({
    to: details.studentEmail,
    subject: 'Refund accepted',
    title: 'Refund accepted',
    intro: 'Your refund was accepted. The payment will be returned.',
    rows,
  });
  await sendRefundEmail({
    to: details.teacherEmail,
    subject: `Refund accepted for ${details.subjectName}`,
    title: 'Refund accepted',
    intro: 'A refund for this class was accepted. The booking is cancelled.',
    rows,
  });
  await sendRefundEmail({
    to: adminEmails,
    subject: `Refund accepted: ${details.subjectName}`,
    title: 'Refund accepted',
    intro: 'This refund request was accepted.',
    rows,
  });
}

export async function sendRefundDeclinedEmails(prisma, details) {
  const adminEmails = await getRefundAdminEmails(prisma);
  const rows = purchaseRows(details);
  if (details.adminNote) rows.push(['Note', details.adminNote]);
  await sendRefundEmail({
    to: details.studentEmail,
    subject: 'Refund request declined',
    title: 'Refund request declined',
    intro: 'Your refund request was declined. The class remains booked.',
    rows,
  });
  await sendRefundEmail({
    to: adminEmails,
    subject: `Refund declined: ${details.subjectName}`,
    title: 'Refund request declined',
    intro: 'This refund request was declined.',
    rows,
  });
}
