import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authRequired } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createRazorpayOrderSchema, verifyPaymentSchema } from '../validators/paymentValidators.js';

const router = Router();

router.use(authRequired);

router.post(
  '/razorpay-order',
  validateBody(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder
);
router.post('/verify', validateBody(verifyPaymentSchema), paymentController.verifyPayment);

export default router;
