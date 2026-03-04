import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'USER' | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  googleId?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    createdAt: { type: Date, default: Date.now },
    googleId: { type: String, sparse: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: false, versionKey: false }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
