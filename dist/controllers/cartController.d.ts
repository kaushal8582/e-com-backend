import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare function getCart(req: AuthRequest, res: Response): Promise<void>;
export declare function addItem(req: AuthRequest, res: Response): Promise<void>;
export declare function updateItem(req: AuthRequest, res: Response): Promise<void>;
export declare function removeItem(req: AuthRequest, res: Response): Promise<void>;
export declare function syncCart(req: AuthRequest, res: Response): Promise<void>;
