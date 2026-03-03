import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare function createRazorpayOrder(req: AuthRequest, res: Response): Promise<void>;
export declare function verifyPayment(req: AuthRequest, res: Response): Promise<void>;
