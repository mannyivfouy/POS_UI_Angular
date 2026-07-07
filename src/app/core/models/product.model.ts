import { Category } from './category.model';
import { Supplier } from './supplier.model';

export interface Product {
  _id: string;
  name: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockAlert: 10 | number;
  unit: string;
  description?: string;
  categoryId: Category;
  supplierId: Supplier;
  image?: string;
  status: 'active' | 'inactive' | string;
  createdAt: Date;
  updatedAt: Date;
}
