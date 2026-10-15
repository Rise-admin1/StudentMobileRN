import express from 'express';
import { verifyToken, requireRole } from '../middlewares/jwt.js';
import { getBilling, requestPurchaseRefund } from '../controllers/billing-controller.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('STUDENT', 'PARENT'), getBilling);
router.post(
  '/purchases/:purchaseId/refund-request',
  verifyToken,
  requireRole('STUDENT'),
  requestPurchaseRefund
);

export default router;
