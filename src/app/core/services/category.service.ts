import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Category } from '../models/category.model';
import { CategoryStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Observable<PaginatedResponse<Category>> {
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

    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, options);
  }

    // CREATE
    createCategory(data: any): Observable<Category> {
      return this.http.post<Category>(`${this.apiUrl}/create`, data);
    }

    // UPDATE
    updateCategory(id: string, data: FormData): Observable<Category> {
      return this.http.put<Category>(`${this.apiUrl}/update/${id}`, data);
    }

    // DELETE
    deleteCategory(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // stats
    getCategoryStats(): Observable<CategoryStats> {
      return this.http.get<CategoryStats>(`${this.apiUrl}/stats`);
    }
}
