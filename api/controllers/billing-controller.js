import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const purchaseSelect = {
  id: true,
  purchaseAmount: true,
  purchaseCurrency: true,
  purchaseDate: true,
  purchaseReceiptUrl: true,
  subject: { select: { subjectName: true } },
};

const mapPurchase = (row) => ({
  id: row.id,
  subjectName: row.subject?.subjectName || 'Course',
  purchaseAmount: row.purchaseAmount,
  purchaseCurrency: row.purchaseCurrency,
  purchaseDate: row.purchaseDate,
  purchaseReceiptUrl: row.purchaseReceiptUrl || null,
});

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
          purchaseStatus: 'CONFIRMED',
        },
        orderBy: { purchaseDate: 'desc' },
        select: purchaseSelect,
      });

      return res.status(200).json({
        role: 'STUDENT',
        purchases: rows.map(mapPurchase),
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
                where: { purchaseStatus: 'CONFIRMED' },
                orderBy: { purchaseDate: 'desc' },
                select: purchaseSelect,
              },
            },
          },
        },
      });

      return res.status(200).json({
        role: 'PARENT',
        students: links.map((link) => ({
          studentProfileId: link.student.id,
          studentName: link.student.user?.name || 'Student',
          purchases: (link.student.stripePurchases || []).map(mapPurchase),
        })),
      });
    }

    return res.status(403).json({ message: 'Billing is not available for this account' });
  } catch (err) {
    next(err);
  }
};
