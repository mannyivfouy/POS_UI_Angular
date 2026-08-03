import { Customer } from './customer.mode';
import { Product } from './product.model';
import { User } from './user.model';

export interface Sale {
  _id: string;
  invoiceNo: string;
  customerId: Customer;
  saleDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | string;
  note?: string;
  createdBy?: User;
}

export interface SaleItem {
  _id: string;
  saleId: Sale;
  productId: Product;
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface SaleDetailResponse {
  message: string;
  data: {
    sale: Sale;
    items: SaleItem[];
  };
}
