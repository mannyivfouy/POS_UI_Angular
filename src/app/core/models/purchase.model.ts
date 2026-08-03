import { Product } from './product.model';
import { Supplier } from './supplier.model';
import { User } from './user.model';

export interface Purchase {
  _id: string;
  invoiceNo: string;
  supplierId: Supplier;
  purchaseDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | string;
  note?: string;
  createdBy?: User;
}

export interface PurchaseItem {
  _id: string;
  purchaseId: Purchase;
  productId: Product;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface PurchaseDetailResponse {
  message: string;
  data: {
    purchase: Purchase;
    items: PurchaseItem[];
  };
}

export interface CreatePurchase {
  supplierId: string;
  purchaseDate: Date;
  paymentStatus: 'pending' | 'paid';

  items: CreatePurchaseItem[];

  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;

  note?: string;
}

export interface CreatePurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface PurchaseItemForm extends CreatePurchaseItem {
  product: Product;
}
