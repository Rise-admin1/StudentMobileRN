import express from 'express';
const router = express.Router();
import { getPublisherKey, paymentSheet, purchaseReady } from '../controllers/stripe-controller.js';
import { verifyToken } from '../middlewares/jwt.js';

router.get('/get-publisher-key', getPublisherKey);
router.get('/purchase-ready', verifyToken, purchaseReady);
router.post('/payment-sheet', verifyToken, paymentSheet);    
  

export default router;