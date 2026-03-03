import { Response } from 'express';
import * as authService from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { RegisterBody, LoginBody } from '../validators/authValidators.js';

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, password } = req.body as RegisterBody;
  const { user, token } = await authService.register(name, email, password);
  res.status(201).json({ success: true, user, token });
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;
  const { user, token } = await authService.login(email, password);
  res.json({ success: true, user, token });
}

export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  res.json({ success: true, message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.tokenPayload?.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const user = await authService.getMe(userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, user });
}
