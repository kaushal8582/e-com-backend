import { Document, Model } from 'mongoose';
export type UserRole = 'USER' | 'ADMIN';
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}
export declare const User: Model<IUser>;
