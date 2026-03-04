import { IUser } from '../models/User.js';
export declare function register(name: string, email: string, password: string): Promise<{
    user: IUser;
    token: string;
}>;
export declare function login(email: string, password: string): Promise<{
    user: IUser;
    token: string;
}>;
export declare function getMe(userId: string): Promise<IUser | null>;
export declare function requestPasswordReset(email: string): Promise<void>;
export declare function resetPassword(token: string, newPassword: string): Promise<void>;
export declare function loginWithGoogle(idToken: string): Promise<{
    user: IUser;
    token: string;
}>;
