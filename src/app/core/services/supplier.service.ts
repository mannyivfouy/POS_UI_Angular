import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Supplier } from '../models/supplier.model';
import { SupplierStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}
  
  getSuppliers(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<PaginatedResponse<Supplier>> {
    let httpParams = new HttpParams();

    if (params.page != null) {
      httpParams = httpParams.set('page', String(params.page));
    }

    if (params.page != null) {
      httpParams = httpParams.set('limit', String(params.limit));
    }

    if (params.page != null) {
      httpParams = httpParams.set('search', String(params.search));
    }

    return this.http.get<PaginatedResponse<Supplier>>(this.apiUrl, {
      params: httpParams,
    });
  }

  getSupplierStats(): Observable<SupplierStats> {
    return this.http.get<SupplierStats>(`${this.apiUrl}/stats`);
  }
}
