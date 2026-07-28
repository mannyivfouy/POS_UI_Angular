import { Product } from './product.model';
import { Supplier } from './supplier.model';
import { User } from './user.model';

export interface Purchase {
  _id: string;
  invoiceNo: string;
  supplierId: Supplier;
  purchaseData: Date;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  note?: string;
  createdBy: User;
}

export interface PurchaseItem {
  _id: string;
  purchaseId: Purchase;
  productId: Product;
  quantity: number;
  costPrice: number;
  total: number;
}
