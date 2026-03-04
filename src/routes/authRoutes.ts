import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleLoginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authRequired, authController.me);
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), authController.resetPassword);
router.post('/google', validateBody(googleLoginSchema), authController.googleLogin);

export default router;
