import { z } from 'zod';
export declare const productsQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    category: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    search: string;
    skip: number;
    limit: number;
    category: string;
}, {
    search?: string | undefined;
    skip?: number | undefined;
    limit?: number | undefined;
    category?: string | undefined;
}>;
export declare const productSlugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare const productIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const createProductSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    price: z.ZodNumber;
    discountPrice: z.ZodOptional<z.ZodNumber>;
    category: z.ZodString;
    stock: z.ZodDefault<z.ZodNumber>;
    images: z.ZodDefault<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId: string;
    }, {
        url: string;
        publicId: string;
    }>, "many">>;
    specs: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    slug: string;
    price: number;
    category: string;
    stock: number;
    images: {
        url: string;
        publicId: string;
    }[];
    specs: Record<string, string>;
    isActive: boolean;
    discountPrice?: number | undefined;
}, {
    title: string;
    slug: string;
    price: number;
    category: string;
    description?: string | undefined;
    discountPrice?: number | undefined;
    stock?: number | undefined;
    images?: {
        url: string;
        publicId: string;
    }[] | undefined;
    specs?: Record<string, string> | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    discountPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    category: z.ZodOptional<z.ZodString>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId: string;
    }, {
        url: string;
        publicId: string;
    }>, "many">>>;
    specs: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    price?: number | undefined;
    discountPrice?: number | undefined;
    category?: string | undefined;
    stock?: number | undefined;
    images?: {
        url: string;
        publicId: string;
    }[] | undefined;
    specs?: Record<string, string> | undefined;
    isActive?: boolean | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    price?: number | undefined;
    discountPrice?: number | undefined;
    category?: string | undefined;
    stock?: number | undefined;
    images?: {
        url: string;
        publicId: string;
    }[] | undefined;
    specs?: Record<string, string> | undefined;
    isActive?: boolean | undefined;
}>;
export type ProductsQuery = z.infer<typeof productsQuerySchema>;
export type CreateProductBody = z.infer<typeof createProductSchema>;
export type UpdateProductBody = z.infer<typeof updateProductSchema>;
