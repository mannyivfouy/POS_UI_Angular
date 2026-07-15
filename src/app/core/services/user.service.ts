import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { User } from '../models/user.model';
import { UserStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    roleId?: string;
  }): Observable<PaginatedResponse<User>> {
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

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    if (params.roleId) {
      httpParams = httpParams.set('roleId', params.roleId);
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

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, options);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  createUser(data: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  // UPDATE
  updateUser(id: string, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // STATS
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  // PROFILE
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, data);
  }
}
