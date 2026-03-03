import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    address: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        pincode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        pincode: string;
        addressLine2?: string | undefined;
    }, {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        pincode: string;
        addressLine2?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    address: {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        pincode: string;
        addressLine2?: string | undefined;
    };
}, {
    address: {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        pincode: string;
        addressLine2?: string | undefined;
    };
}>;
export declare const orderIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]>;
}, "strip", z.ZodTypeAny, {
    status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}, {
    status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}>;
export declare const ordersQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skip: number;
    limit: number;
    status?: string | undefined;
}, {
    skip?: number | undefined;
    limit?: number | undefined;
    status?: string | undefined;
}>;
export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusSchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
