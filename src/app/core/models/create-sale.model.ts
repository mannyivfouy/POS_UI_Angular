export interface CreateSaleRequest {
  customerId: string;
  saleDate: Date;
  discount: number;
  tex: number;
  note?: string;
  createdBy: string;
  items: CreateSaleItemRequest[];
}

export interface CreateSaleItemRequest {
  productId: string;
  quantity: number;
  sellingPrice: number;
}
