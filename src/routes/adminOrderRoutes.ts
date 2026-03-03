import { Router } from 'express';
import * as adminOrderController from '../controllers/adminOrderController.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import { ordersQuerySchema, orderIdParamSchema, updateOrderStatusSchema } from '../validators/orderValidators.js';

const router = Router();

router.use(authRequired, adminOnly);

router.get('/', validateQuery(ordersQuerySchema), adminOrderController.listOrders);
router.get('/:id', validateParams(orderIdParamSchema), adminOrderController.getOrderById);
router.patch('/:id/status', validateParams(orderIdParamSchema), validateBody(updateOrderStatusSchema), adminOrderController.updateOrderStatus);

export default router;
