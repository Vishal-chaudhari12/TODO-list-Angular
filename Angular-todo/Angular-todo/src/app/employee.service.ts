import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:3002/employee';

  constructor(private http: HttpClient) { }

  // Get all employees
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get employee by ID
  getEmployeeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new employee
  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, employee).pipe(
      catchError(this.handleError)
    );
  }

  // Update employee
  updateEmployee(id: string, employee: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, employee).pipe(
      catchError(this.handleError)
    );
  }

  // Delete employee
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
