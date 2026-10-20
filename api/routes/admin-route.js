import express from 'express';
import { verifyToken, requireRole } from '../middlewares/jwt.js';
import {
  getAdminStats,
  getAdminRequestLogs,
  askAdminRequestLog,
  getAdminTeachers,
  getAdminTeacherDetail,
  getAdminOrganizations,
  getAdminOrganizationDetail,
  getAdminParents,
  getAdminParentDetail,
  getAdminPurchases,
  getAdminPurchaseDetail,
  getAdminReportDetail,
  getAdminRefundRequests,
  acceptAdminRefundRequest,
  declineAdminRefundRequest,
  getAdminDeletionRequests,
  approveAdminDeletionRequest,
} from '../controllers/admin-controller.js';

const router = express.Router();

router.get('/stats', verifyToken, requireRole('ADMIN'), getAdminStats);
router.get('/request-logs', verifyToken, requireRole('ADMIN'), getAdminRequestLogs);
router.post('/request-logs/:logId/ask', verifyToken, requireRole('ADMIN'), askAdminRequestLog);
router.get('/teachers', verifyToken, requireRole('ADMIN'), getAdminTeachers);
router.get('/teachers/:userId', verifyToken, requireRole('ADMIN'), getAdminTeacherDetail);
router.get('/organizations', verifyToken, requireRole('ADMIN'), getAdminOrganizations);
router.get(
  '/organizations/:organizationId',
  verifyToken,
  requireRole('ADMIN'),
  getAdminOrganizationDetail
);
router.get('/parents', verifyToken, requireRole('ADMIN'), getAdminParents);
router.get('/parents/:userId', verifyToken, requireRole('ADMIN'), getAdminParentDetail);
router.get('/purchases', verifyToken, requireRole('ADMIN'), getAdminPurchases);
router.get('/purchases/:purchaseId', verifyToken, requireRole('ADMIN'), getAdminPurchaseDetail);
router.get('/reports/:reportId', verifyToken, requireRole('ADMIN'), getAdminReportDetail);
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
