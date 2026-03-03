import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { validateParams } from '../middleware/validate.js';
import { deleteImageParamSchema } from '../validators/uploadValidators.js';
import { upload } from '../config/multer.js';

const router = Router();

router.use(authRequired, adminOnly);

router.post(
  '/image',
  upload.single('image'),
  uploadController.uploadImage
);

router.delete('/cloudinary/:publicId', validateParams(deleteImageParamSchema), uploadController.deleteCloudinaryImage);

export default router;
