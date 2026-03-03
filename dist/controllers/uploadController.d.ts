import { Response } from 'express';
export declare function getCloudinarySignature(req: {
    query: {
        folder?: string;
    };
}, res: Response): Promise<void>;
export declare function deleteCloudinaryImage(req: {
    params: {
        publicId: string;
    };
}, res: Response): Promise<void>;
