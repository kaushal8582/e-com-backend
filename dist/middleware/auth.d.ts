import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User.js';
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export interface AuthRequest extends Request {
    user?: IUser;
    tokenPayload?: JwtPayload;
}
export declare function authRequired(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void;
