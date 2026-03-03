import { Product, IProduct } from '../models/Product.js';

export interface ListProductsParams {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  includeDeleted?: boolean;
}

export async function listProducts(params: ListProductsParams): Promise<{ products: IProduct[]; total: number }> {
  const { limit, skip, search, category, includeDeleted } = params;
  const filter: Record<string, unknown> = { isActive: true, isDeleted: false };
  if (!includeDeleted) {
    filter.isDeleted = false;
  }
  if (category) filter.category = category;
  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { title: new RegExp(term, 'i') },
      { description: new RegExp(term, 'i') },
      { category: new RegExp(term, 'i') },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    Product.countDocuments(filter),
  ]);

  return { products: products as unknown as IProduct[], total };
}

export async function findBySlug(slug: string): Promise<IProduct | null> {
  return Product.findOne({ slug, isActive: true, isDeleted: false }).exec();
}

export async function findById(id: string): Promise<IProduct | null> {
  return Product.findById(id).exec();
}

export async function createProduct(data: Partial<IProduct>): Promise<IProduct> {
  const product = new Product(data);
  return product.save();
}

export async function updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
  return Product.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
}

export async function softDeleteProduct(id: string): Promise<IProduct | null> {
  return Product.findByIdAndUpdate(id, { $set: { isDeleted: true, isActive: false } }, { new: true }).exec();
}

export async function listAdminProducts(params: ListProductsParams): Promise<{ products: IProduct[]; total: number }> {
  const { limit, skip, search, includeDeleted = true } = params;
  const filter: Record<string, unknown> = {};
  if (!includeDeleted) filter.isDeleted = false;
  if (params.category) filter.category = params.category;
  if (search && search.trim()) {
    filter.$or = [
      { title: new RegExp(search.trim(), 'i') },
      { slug: new RegExp(search.trim(), 'i') },
      { category: new RegExp(search.trim(), 'i') },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
    Product.countDocuments(filter),
  ]);

  return { products: products as unknown as IProduct[], total };
}
