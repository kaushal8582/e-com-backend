import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare function register(req: AuthRequest, res: Response): Promise<void>;
export declare function login(req: AuthRequest, res: Response): Promise<void>;
export declare function logout(_req: AuthRequest, res: Response): Promise<void>;
export declare function me(req: AuthRequest, res: Response): Promise<void>;
export declare function forgotPassword(req: AuthRequest, res: Response): Promise<void>;
export declare function resetPassword(req: AuthRequest, res: Response): Promise<void>;
export declare function googleLogin(req: AuthRequest, res: Response): Promise<void>;
