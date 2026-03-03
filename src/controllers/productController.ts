import { Request, Response } from 'express';
import * as productService from '../services/productService.js';
import { ProductsQuery } from '../validators/productValidators.js';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const { limit, skip, search, category } = (req as Request & { query: ProductsQuery }).query;
  const { products, total } = await productService.listPublic({ limit, skip, search, category });
  res.json({ success: true, data: { products, total } });
}

export async function getBySlug(req: { params: { slug: string } }, res: Response): Promise<void> {
  const param = req.params.slug;
  const isMongoId = /^[a-f\d]{24}$/i.test(param);
  const product = isMongoId
    ? await productService.getById(param)
    : await productService.getBySlug(param);
  if (!product || product.isDeleted || !product.isActive) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, data: product });
}
