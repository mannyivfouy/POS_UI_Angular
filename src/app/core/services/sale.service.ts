import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Sale, SaleDetailResponse } from '../models/sale.model';
import { ReactiveFormsModule } from '@angular/forms';
import { SaleStats } from '../models/stats.model';
import {
  CompleteSaleRequest,
  PrepareSalePaymentRequest,
  PrepareSalePaymentResponse,
} from '../models/sale-payment.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getSales(params: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: string;
  }): Observable<PaginatedResponse<Sale>> {
    let httpParams = new HttpParams();

    if (params.page != null) {
      httpParams = httpParams.set('page', String(params.page));
    }

    if (params.limit != null) {
      httpParams = httpParams.set('limit', String(params.limit));
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.paymentStatus) {
      httpParams = httpParams.set('paymentStatus', params.paymentStatus);
    }

    let options: {
      params: HttpParams;
      headers?: HttpHeaders;
    } = {
      params: httpParams,
    };

    // Skip full loading screen when searching
    if (params.search) {
      options.headers = new HttpHeaders({
        'skip-loading': 'true',
      });
    }

    return this.http.get<PaginatedResponse<Sale>>(this.apiUrl, options);
  }

  prepareSalePayment(data: PrepareSalePaymentRequest): Observable<PrepareSalePaymentResponse> {
    return this.http.post<PrepareSalePaymentResponse>(`${this.apiUrl}/prepare-payment`, data);
  }

  completeSale(data: CompleteSaleRequest): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/complete`, data);
  }

  getSaleById(id: string): Observable<SaleDetailResponse> {
    return this.http.get<SaleDetailResponse>(`${this.apiUrl}/${id}`);
  }

  getSaleStats(): Observable<SaleStats> {
    return this.http.get<SaleStats>(`${this.apiUrl}/stats`);
  }
}
