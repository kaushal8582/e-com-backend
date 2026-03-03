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
}): Promise<IUser> {
  const user = new User(data);
  return user.save();
}
