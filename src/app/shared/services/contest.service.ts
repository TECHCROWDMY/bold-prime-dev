import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable, throwError, catchError, interval, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { SKIP_INTERCEPT } from './skip-interceptor.token';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  private leaderboard$ = new BehaviorSubject<any[]>([]);
  private leaderboardHistory$ = new BehaviorSubject<any[]>([]);
  private contestId: number = 1;
  private pageSize: number = 500; // Number of items per page
  private currentPage: number = 1;
  private totalRecords: number = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService  // inject the AuthService
    
  ) {
     // Fetch every 10 minutes
     interval(600000).subscribe(() => {
        this.fetchLeaderboard();
      });
  }

  setContestId(id: number) {
    this.contestId = id;
    this.currentPage = 1;
    this.fetchLeaderboard();
    // this.fetchLeaderboardHistory();
  }

  getLeaderboardObservable() {
    return this.leaderboard$.asObservable();
  }

  getLeaderboardHistoryObservable() {
    return this.leaderboardHistory$.asObservable();
  }

  fetchLeaderboard(): void {
    try {        
        const token_api = this.authService.getToken(); 
        if (!token_api) {
        // return throwError(() => new Error('Token is not available. Please log in first.'));
        }

        const url = `${environment.API_BASE_URL}rest/contest/leaders?version=1.0.0`;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token_api}`,
        'Content-Type': 'application/json'
        });

        const offset = (this.currentPage - 1) * this.pageSize;

        const body = {
            contestId: this.contestId,
            segment: { limit: this.pageSize, offset: offset }
        }; 

      this.http.post<any>(url, body, { headers, context: new HttpContext().set(SKIP_INTERCEPT, true) }).subscribe( (data) => {            
              this.leaderboard$.next(data);
              console.log(data);
            },
            (error) => {
              console.error('Error fetching leaderboard:', error);
            } 
      );
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
 

  getLeaders(id: number): Observable<any> {
    const token_api = this.authService.getToken(); 
    if (!token_api) {
      return throwError(() => new Error('Token is not available. Please log in first.'));
    }

    const url = `${environment.API_BASE_URL}rest/contest/leaders?version=1.0.0`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token_api}`,
      'Content-Type': 'application/json'
    });

    const body = {
      contestId: id,
      segment: { limit: 500, offset: 0 }
    };

    return this.http.post<any>(url, body, { headers, context: new HttpContext().set(SKIP_INTERCEPT, true) }).pipe(
        map((res: any) => {
        //   console.log('Response:', res);
          return res; // ensure we pass the data downstream
        }),
        // catchError to handle errors and log them
        catchError((err) => {
          console.error('Error:', err);
          return throwError(() => err);
        })
      );
  }
}
