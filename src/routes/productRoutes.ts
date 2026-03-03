import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { validateQuery, validateParams } from '../middleware/validate.js';
import { productsQuerySchema, productSlugParamSchema } from '../validators/productValidators.js';

const router = Router();

router.get('/', validateQuery(productsQuerySchema), productController.listProducts);
router.get('/:slug', validateParams(productSlugParamSchema), productController.getBySlug);

export default router;
