import { Request, Response } from 'express';
import * as productService from '../services/productService.js';
import { ProductsQuery, CreateProductBody, UpdateProductBody } from '../validators/productValidators.js';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const { limit, skip, search, category } = (req as Request & { query: ProductsQuery }).query;
  const { products, total } = await productService.listAdmin({ limit, skip, search, category });
  res.json({ success: true, data: { products, total } });
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = (req as Request & { params: { id: string } }).params.id;
  const product = await productService.getById(id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, data: product });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.createProduct((req as Request & { body: CreateProductBody }).body);
  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const r = req as Request & { params: { id: string }; body: UpdateProductBody };
  const product = await productService.updateProduct(r.params.id, r.body);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, data: product });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.softDeleteProduct((req as Request & { params: { id: string } }).params.id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, message: 'Product deleted' });
}
