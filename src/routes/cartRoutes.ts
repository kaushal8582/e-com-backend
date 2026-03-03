import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { authRequired } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { addCartItemSchema, productIdParamSchema, updateCartItemSchema, syncCartSchema } from '../validators/cartValidators.js';

const router = Router();

router.use(authRequired);

router.get('/', cartController.getCart);
router.post('/items', validateBody(addCartItemSchema), cartController.addItem);
router.patch('/items/:productId', validateParams(productIdParamSchema), validateBody(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:productId', validateParams(productIdParamSchema), cartController.removeItem);
router.post('/sync', validateBody(syncCartSchema), cartController.syncCart);

export default router;
