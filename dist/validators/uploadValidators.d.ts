import { z } from 'zod';
export declare const cloudinarySignQuerySchema: z.ZodObject<{
    folder: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    folder: string;
}, {
    folder?: string | undefined;
}>;
export declare const deleteImageParamSchema: z.ZodObject<{
    publicId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    publicId: string;
}, {
    publicId: string;
}>;
