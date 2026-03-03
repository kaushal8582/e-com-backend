import { Request, Response } from 'express';
export declare function listProducts(req: Request, res: Response): Promise<void>;
export declare function getBySlug(req: {
    params: {
        slug: string;
    };
}, res: Response): Promise<void>;
