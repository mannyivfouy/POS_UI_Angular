import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/purchases`;

  constructor(private http: HttpClient) {}

  getPurchases(params: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: string;
  }): Observable<PaginatedResponse<Purchase>> {
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

    return this.http.get<PaginatedResponse<Purchase>>(this.apiUrl, options);
  }

  getPurchaseById(id: string): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`);
  }

  createPurchase(data: FormData): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.apiUrl}/create`, data);
  }
}
