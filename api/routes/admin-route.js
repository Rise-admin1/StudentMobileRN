import express from 'express';
import { verifyToken, requireRole } from '../middlewares/jwt.js';
import {
  getAdminStats,
  getAdminTeachers,
  getAdminOrganizations,
  getAdminParents,
  getAdminPurchases,
  getAdminRefundRequests,
  acceptAdminRefundRequest,
  declineAdminRefundRequest,
  getAdminDeletionRequests,
  approveAdminDeletionRequest,
} from '../controllers/admin-controller.js';

const router = express.Router();

router.get('/stats', verifyToken, requireRole('ADMIN'), getAdminStats);
router.get('/teachers', verifyToken, requireRole('ADMIN'), getAdminTeachers);
router.get('/organizations', verifyToken, requireRole('ADMIN'), getAdminOrganizations);
router.get('/parents', verifyToken, requireRole('ADMIN'), getAdminParents);
router.get('/purchases', verifyToken, requireRole('ADMIN'), getAdminPurchases);
router.get('/refund-requests', verifyToken, requireRole('ADMIN'), getAdminRefundRequests);
router.post(
  '/refund-requests/:refundRequestId/accept',
  verifyToken,
  requireRole('ADMIN'),
  acceptAdminRefundRequest
);
router.post(
  '/refund-requests/:refundRequestId/decline',
  verifyToken,
  requireRole('ADMIN'),
  declineAdminRefundRequest
);
router.get('/deletion-requests', verifyToken, requireRole('ADMIN'), getAdminDeletionRequests);
router.post(
  '/deletion-requests/:deletionRequestId/approve',
  verifyToken,
  requireRole('ADMIN'),
  approveAdminDeletionRequest
);

export default router;
