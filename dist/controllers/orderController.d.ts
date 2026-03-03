import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare function createOrder(req: AuthRequest, res: Response): Promise<void>;
export declare function getMyOrders(req: AuthRequest, res: Response): Promise<void>;
export declare function getOrderById(req: AuthRequest, res: Response): Promise<void>;
