import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    status?: string;
  }): Observable<PaginatedResponse<Supplier>> {
    let httpParams = new HttpParams();

    if (params.page != null) {
      httpParams = httpParams.set('page', String(params.page));
    }

    if (params.limit != null) {
      httpParams = httpParams.set('limit', String(params.limit));
    }

    if (params.search != null) {
      httpParams = httpParams.set('search', String(params.search));
    }

    if (params.status) {
      httpParams = httpParams.set('status', String(params.status));
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

    return this.http.get<PaginatedResponse<Supplier>>(this.apiUrl, options);
  }

  // CREATE
  createSupplier(data: any): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.apiUrl}/create`, data);
  }

  // UPDATE
  updateSupplier(id: string, data: FormData): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/update/${id}`, data);
  }

  // DELETE
  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // stats
  getSupplierStats(): Observable<SupplierStats> {
    return this.http.get<SupplierStats>(`${this.apiUrl}/stats`);
  }
}
