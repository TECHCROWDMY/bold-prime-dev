import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user and stores the token in memory.
   * You can also use localStorage if you want persistence.
   */
  login(): Observable<any> {
    localStorage.setItem('token_api', environment.TOKEN);
    const loginUrl = `${environment.API_BASE_URL}ca-rest/login`;
    const loginPayload = {
        username: environment.USERNAME,
        password: environment.PASSWORD
      };

      return this.http.post<any>(loginUrl, loginPayload).pipe(
        tap(response => {
          console.log(response);
          // Suppose the API returns { token: '...' }
          this.authToken = response.token;
          // Or store in local storage:
          localStorage.setItem('token', response.token);
        }),
        catchError((err: any) => {
          console.error('Login error:', err);
          // Rethrow the error so the subscriber can handle it
          return throwError(() => err);
        })
      );

      
  }

  /**
   * Returns the currently stored token. 
   * If using localStorage, retrieve it from localStorage here instead.
   */
  getToken(): string | null {
    // return this.authToken;
    localStorage.setItem('token_api', environment.TOKEN);
    // console.log(localStorage.getItem('token_api'));
    // If using localStorage instead:
    // if (localStorage.getItem('token') == null) {
    //     console.log('call login');
    //     this.login().subscribe({
    //         next: (response) => {
    //           console.log('Logged in successfully:', response);
    //         },
    //         error: (error) => {
    //           console.error('Error while logging in:', error);
    //         }
    //       });

    // }
    return localStorage.getItem('token_api');
  }

  /**
   * Logs out by clearing the token from memory/localStorage.
   */
  logout(): void {
    // this.authToken = null;
    localStorage.removeItem('token');
  }
}
