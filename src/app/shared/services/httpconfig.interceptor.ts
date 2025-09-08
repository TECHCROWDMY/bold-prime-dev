import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SKIP_INTERCEPT } from './skip-interceptor.token';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string = localStorage.getItem('boldAccessToken') || '';

   

    if (request.context.get(SKIP_INTERCEPT) === false) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
    }

    return next.handle(request).pipe(
      tap(
        (success) => { },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.error.message == 'Token expired') {
              localStorage.clear();
              this.router.navigate(['/login']);
              window.location.reload();
            } else if (err.status == 401 || err.status == 403) {
              // localStorage.clear();
              // this.router.navigate(['/login']);
            }
          }
        }
      )
    );
  }
}
