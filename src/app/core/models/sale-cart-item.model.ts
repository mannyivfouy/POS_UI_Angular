import { Product } from './product.model';

export interface SaleCartItem {
  product: Product;
  quantity: number;
  sellingPrice: number;
  total: number;
}
