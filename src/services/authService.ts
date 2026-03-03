import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository.js';
import { IUser } from '../models/User.js';

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
  return { user: u as IUser, token };
}

export async function getMe(userId: string): Promise<IUser | null> {
  const user = await userRepo.findById(userId);
  if (!user) return null;
  const u = user.toObject();
  delete (u as Record<string, unknown>).passwordHash;
  return u as IUser;
}
