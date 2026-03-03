import { z } from 'zod';
export declare const addCartItemSchema: z.ZodObject<{
    productId: z.ZodString;
    qty: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: string;
    qty: number;
}, {
    productId: string;
    qty: number;
}>;
export declare const productIdParamSchema: z.ZodObject<{
    productId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: string;
}, {
    productId: string;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    qty: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    qty: number;
}, {
    qty: number;
}>;
export declare const syncCartSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        qty: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        qty: number;
    }, {
        productId: string;
        qty: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        productId: string;
        qty: number;
    }[];
}, {
    items: {
        productId: string;
        qty: number;
    }[];
}>;
export type AddCartItemBody = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemBody = z.infer<typeof updateCartItemSchema>;
export type SyncCartBody = z.infer<typeof syncCartSchema>;
