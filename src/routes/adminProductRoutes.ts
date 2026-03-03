import { Router } from 'express';
import * as adminProductController from '../controllers/adminProductController.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import {
  productsQuerySchema,
  productIdParamSchema,
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidators.js';

const router = Router();

router.use(authRequired, adminOnly);

router.get('/', validateQuery(productsQuerySchema), adminProductController.listProducts);
router.get('/:id', validateParams(productIdParamSchema), adminProductController.getProductById);
router.post('/', validateBody(createProductSchema), adminProductController.createProduct);
router.patch('/:id', validateParams(productIdParamSchema), validateBody(updateProductSchema), adminProductController.updateProduct);
router.delete('/:id', validateParams(productIdParamSchema), adminProductController.deleteProduct);

export default router;
