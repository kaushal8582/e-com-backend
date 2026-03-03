import { z } from 'zod';

export const cloudinarySignQuerySchema = z.object({
  folder: z.string().min(1).default('ecommerce'),
});

export const deleteImageParamSchema = z.object({
  publicId: z.string().min(1),
});
