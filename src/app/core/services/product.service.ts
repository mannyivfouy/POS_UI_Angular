import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { LowStockResponse, Product, ProductDetailResponse } from '../models/product.model';
import { ProductStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<PaginatedResponse<Product>> {
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

    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, {
      params: httpParams,
    });
  }

  getProductStats(): Observable<ProductStats> {
    return this.http.get<ProductStats>(`${this.apiUrl}/stats`);
  }

  getLowStockAlert(): Observable<LowStockResponse> {
    return this.http.get<LowStockResponse>(`${this.apiUrl}/low-stock`)
  }

  getProductById(id: string): Observable<ProductDetailResponse<Product>> {
    return this.http.get<ProductDetailResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  createUser(data: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/create`, data);
  }

  // UPDATE
  updateUser(id: string, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/update/${id}`, data);
  }

  // DELETE
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
