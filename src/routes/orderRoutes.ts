import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { authRequired } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { createOrderSchema, orderIdParamSchema } from '../validators/orderValidators.js';

const router = Router();

router.use(authRequired);

router.post('/', validateBody(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', validateParams(orderIdParamSchema), orderController.getOrderById);

export default router;
