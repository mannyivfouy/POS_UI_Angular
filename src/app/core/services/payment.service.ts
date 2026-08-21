import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CheckBakongPaymentRequest,
  CheckBakongPaymentResponse,
  CreateBakongPaymentRequest,
  CreateBakongPaymentResponse,
} from '../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment}/payment/bakong`;

  constructor(private http: HttpClient) {}

  createBakongPayment(data: CreateBakongPaymentRequest): Observable<CreateBakongPaymentResponse> {
    return this.http.post<CreateBakongPaymentResponse>(`${this.apiUrl}/create`, data);
  }

  checkBakongPayment(data: CheckBakongPaymentRequest): Observable<CheckBakongPaymentResponse> {
    return this.http.post<CheckBakongPaymentResponse>(`${this.apiUrl}/check`, data);
  }
}
