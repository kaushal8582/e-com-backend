import { Response } from 'express';
import * as authService from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { RegisterBody, LoginBody, ForgotPasswordBody, ResetPasswordBody, GoogleLoginBody } from '../validators/authValidators.js';

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body as RegisterBody;
    const { user, token } = await authService.register(name, email, password);
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    const status = message === 'Email already registered' ? 409 : 400;
    res.status(status).json({ success: false, message });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginBody;
    const { user, token } = await authService.login(email, password);
    res.json({ success: true, user, token });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(401).json({ success: false, message });
  }
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

export async function forgotPassword(req: AuthRequest, res: Response): Promise<void> {
  const { email } = req.body as ForgotPasswordBody;
  await authService.requestPasswordReset(email);
  res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
}

export async function resetPassword(req: AuthRequest, res: Response): Promise<void> {
  const { token, newPassword } = req.body as ResetPasswordBody;
  try {
    await authService.resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid or expired reset link';
    res.status(400).json({ success: false, message });
  }
}

export async function googleLogin(req: AuthRequest, res: Response): Promise<void> {
  const { idToken } = req.body as GoogleLoginBody;
  try {
    const { user, token } = await authService.loginWithGoogle(idToken);
    res.json({ success: true, user, token });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Google sign-in failed';
    res.status(400).json({ success: false, message });
  }
}
