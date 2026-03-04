import { User, IUser } from '../models/User.js';

export async function findByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).exec();
}

export async function findById(id: string): Promise<IUser | null> {
  return User.findById(id).exec();
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  googleId?: string;
}): Promise<IUser> {
  const user = new User(data);
  return user.save();
}

export async function findByGoogleId(googleId: string): Promise<IUser | null> {
  return User.findOne({ googleId }).exec();
}

export async function setGoogleId(userId: string, googleId: string): Promise<IUser | null> {
  return User.findByIdAndUpdate(userId, { $set: { googleId } }, { new: true }).exec();
}

export async function findByResetToken(token: string): Promise<IUser | null> {
  return User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  }).exec();
}

export async function setResetToken(
  email: string,
  token: string,
  expiry: Date
): Promise<IUser | null> {
  return User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { resetToken: token, resetTokenExpiry: expiry } },
    { new: true }
  ).exec();
}

export async function updatePasswordClearReset(
  userId: string,
  passwordHash: string
): Promise<IUser | null> {
  return User.findByIdAndUpdate(
    userId,
    { $set: { passwordHash }, $unset: { resetToken: 1, resetTokenExpiry: 1 } },
    { new: true }
  ).exec();
}
