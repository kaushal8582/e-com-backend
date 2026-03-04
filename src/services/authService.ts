import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import * as userRepo from '../repositories/userRepository.js';
import { IUser } from '../models/User.js';
import * as emailLib from '../lib/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export async function register(name: string, email: string, password: string): Promise<{ user: IUser; token: string }> {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'USER',
  });
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as jwt.SignOptions
  );
  const u = user.toObject();
  delete (u as Record<string, unknown>).passwordHash;
  return { user: u as IUser, token };
}

export async function login(email: string, password: string): Promise<{ user: IUser; token: string }> {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as jwt.SignOptions
  );
  const u = user.toObject();
  delete (u as Record<string, unknown>).passwordHash;
  emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => {});
  return { user: u as IUser, token };
}

export async function getMe(userId: string): Promise<IUser | null> {
  const user = await userRepo.findById(userId);
  if (!user) return null;
  const u = user.toObject();
  delete (u as Record<string, unknown>).passwordHash;
  return u as IUser;
}

const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await userRepo.findByEmail(email);
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + RESET_EXPIRY_MS);
  await userRepo.setResetToken(email, token, expiry);
  const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  emailLib.sendPasswordReset(user.email, resetLink).catch(() => {});
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const user = await userRepo.findByResetToken(token);
  if (!user) throw new Error('Invalid or expired reset link');
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userRepo.updatePasswordClearReset(user._id.toString(), passwordHash);
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export async function loginWithGoogle(idToken: string): Promise<{ user: IUser; token: string }> {
  if (!GOOGLE_CLIENT_ID) throw new Error('Google sign-in is not configured');
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) throw new Error('Invalid Google token');
  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = (payload.name || payload.email?.split('@')[0] || 'User').trim();

  let user = await userRepo.findByGoogleId(googleId);
  if (user) {
    const u = user.toObject();
    delete (u as Record<string, unknown>).passwordHash;
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY } as jwt.SignOptions
    );
    emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => {});
    return { user: u as IUser, token };
  }

  user = await userRepo.findByEmail(email);
  if (user) {
    if (!user.googleId) await userRepo.setGoogleId(user._id.toString(), googleId);
    const u = user.toObject();
    delete (u as Record<string, unknown>).passwordHash;
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY } as jwt.SignOptions
    );
    emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => {});
    return { user: u as IUser, token };
  }

  const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10);
  user = await userRepo.createUser({
    name,
    email,
    passwordHash,
    role: 'USER',
    googleId,
  });
  const u = user.toObject();
  delete (u as Record<string, unknown>).passwordHash;
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as jwt.SignOptions
  );
  emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => {});
  return { user: u as IUser, token };
}
