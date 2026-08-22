export interface SalePaymentItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
}

export interface PrepareSalePaymentRequest {
  customerId: string | null;
  items: SalePaymentItem[];
  discount: number;
  tax: number;
  note: string;
}

export interface PrepareSalePaymentData {
  invoiceNo: string;
  customerId: string | null;
  items: SalePaymentItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  qr: string;
  md5: string;
}

export interface PrepareSalePaymentResponse {
  message: string;
  data: PrepareSalePaymentData;
}

export interface CompleteSaleRequest {
  invoiceNo: string;
  customerId: string | null;
  items: SalePaymentItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  md5: string;
  note: string;
}
