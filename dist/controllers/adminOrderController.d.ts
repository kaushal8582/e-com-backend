import { Request, Response } from 'express';
export declare function listOrders(req: Request, res: Response): Promise<void>;
export declare function getOrderById(req: Request, res: Response): Promise<void>;
export declare function updateOrderStatus(req: Request, res: Response): Promise<void>;
