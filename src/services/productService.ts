import * as productRepo from '../repositories/productRepository.js';
import { IProduct } from '../models/Product.js';

export async function listPublic(params: {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
}) {
  return productRepo.listProducts({
    ...params,
    includeDeleted: false,
  });
}

export async function getBySlug(slug: string): Promise<IProduct | null> {
  return productRepo.findBySlug(slug);
}

export async function listAdmin(params: {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
}) {
  return productRepo.listAdminProducts({
    ...params,
    includeDeleted: true,
  });
}

export async function createProduct(data: {
  title: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images?: { url: string; publicId: string }[];
  specs?: Record<string, string>;
  isActive?: boolean;
}): Promise<IProduct> {
  return productRepo.createProduct(data);
}

export async function updateProduct(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number;
    category: string;
    stock: number;
    images: { url: string; publicId: string }[];
    specs: Record<string, string>;
    isActive: boolean;
  }>
): Promise<IProduct | null> {
  return productRepo.updateProduct(id, data);
}

export async function softDeleteProduct(id: string): Promise<IProduct | null> {
  return productRepo.softDeleteProduct(id);
}

export async function getById(id: string): Promise<IProduct | null> {
  return productRepo.findById(id);
}
