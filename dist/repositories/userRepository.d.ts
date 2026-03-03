import { IUser } from '../models/User.js';
export declare function findByEmail(email: string): Promise<IUser | null>;
export declare function findById(id: string): Promise<IUser | null>;
export declare function createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'USER' | 'ADMIN';
}): Promise<IUser>;
