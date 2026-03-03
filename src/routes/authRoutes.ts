import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authRequired, authController.me);

export default router;
