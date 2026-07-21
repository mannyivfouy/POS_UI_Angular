import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Customer } from '../models/customer.mode';
import { CustomerStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<PaginatedResponse<Customer>> {
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

    let options: {
      params: HttpParams;
      headers?: HttpHeaders;
    } = {
      params: httpParams,
    };

    if (params.search) {
      options.headers = new HttpHeaders({
        'skip-loading': 'true',
      });
    }

    return this.http.get<PaginatedResponse<Customer>>(this.apiUrl, options);
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  createCustomer(data: FormData): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/create`, data);
  }

  // UPDATE
  updateCustomer(id: string, data: FormData): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/update/${id}`, data);
  }

  // DELETE
  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // STATS
  getCustomerStats(): Observable<CustomerStats> {
    return this.http.get<CustomerStats>(`${this.apiUrl}/stats`);
  }
}
