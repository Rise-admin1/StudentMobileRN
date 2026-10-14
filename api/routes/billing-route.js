import express from 'express';
import { verifyToken, requireRole } from '../middlewares/jwt.js';
import { getBilling } from '../controllers/billing-controller.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('STUDENT', 'PARENT'), getBilling);

export default router;
