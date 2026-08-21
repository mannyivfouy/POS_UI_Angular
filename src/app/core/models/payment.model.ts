export type PaymentMethod = 'cash' | 'bakongKHQR'

export interface CreateBakongPaymentRequest {
  amount: number;
  billNumber: string;
}

export interface CreateBakongPaymentResponse {
  message: string;
  data: {
    qr: string;
    md5: string;
  };
}

export interface CheckBakongPaymentRequest {
  md5: string;
  amount: number;
}

export interface CheckBakongPaymentResponse {
  message: string;
  data: {
    paid: boolean;
    transaction?: {
      hash: string;
      externalRef: string;
      fromAccountId: string;
      toAccountId: string;
      currency: string;
      amount: number;
      createdDateMs: number;
      acknowledgedDateMs: number;
    };
  };
}
