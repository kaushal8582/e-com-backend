import { IUser } from '../models/User.js';
export declare function findByEmail(email: string): Promise<IUser | null>;
export declare function findById(id: string): Promise<IUser | null>;
export declare function createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'USER' | 'ADMIN';
    googleId?: string;
}): Promise<IUser>;
export declare function findByGoogleId(googleId: string): Promise<IUser | null>;
export declare function setGoogleId(userId: string, googleId: string): Promise<IUser | null>;
export declare function findByResetToken(token: string): Promise<IUser | null>;
export declare function setResetToken(email: string, token: string, expiry: Date): Promise<IUser | null>;
export declare function updatePasswordClearReset(userId: string, passwordHash: string): Promise<IUser | null>;
