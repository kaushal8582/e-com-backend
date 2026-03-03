import { z } from 'zod';

export const productsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  skip: z.coerce.number().min(0).default(0),
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
});

export const productSlugParamSchema = z.object({
  slug: z.string().min(1),
});

export const productIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
});

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().default(''),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category is required').max(100),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string() })).default([]),
  specs: z.record(z.string()).default({}),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type ProductsQuery = z.infer<typeof productsQuerySchema>;
export type CreateProductBody = z.infer<typeof createProductSchema>;
export type UpdateProductBody = z.infer<typeof updateProductSchema>;
