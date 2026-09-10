import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = `${environment.apiUrl}/payments/bakong`;

  private readonly skipLoadingHeaders = new HttpHeaders({
    'skip-loading': 'true',
  });

  constructor(private http: HttpClient) {}

  createBakongPayment(data: CreateBakongPaymentRequest): Observable<CreateBakongPaymentResponse> {
    return this.http.post<CreateBakongPaymentResponse>(`${this.apiUrl}/create`, data, {
      headers: this.skipLoadingHeaders,
    });
  }

  checkBakongPayment(data: CheckBakongPaymentRequest): Observable<CheckBakongPaymentResponse> {
    return this.http.post<CheckBakongPaymentResponse>(`${this.apiUrl}/check`, data, {
      headers: this.skipLoadingHeaders,
    });
  }
}
