import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { validateQuery, validateParams } from '../middleware/validate.js';
import { cloudinarySignQuerySchema, deleteImageParamSchema } from '../validators/uploadValidators.js';

const router = Router();

router.get(
  '/cloudinary-signature',
  authRequired,
  adminOnly,
  validateQuery(cloudinarySignQuerySchema),
  uploadController.getCloudinarySignature
);

export default router;
