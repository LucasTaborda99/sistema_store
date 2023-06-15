import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptadorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token')
    if(token) {
      request = request.clone({
        // Setando no header da requisição o token
        setHeaders:{Authorization: `Bearer ${token}`}
      })
    }

    // Caso de algum erro ele redireciona à homepage
    return next.handle(request).pipe(
      catchError((err) => {
        if(err instanceof HttpErrorResponse){
          console.log(err.url)
          if(err.status === 401 || err.status === 403) {
            if(this.router.url === '/') {}
            else {
              localStorage.clear()
              this.router.navigate(['/'])
            }
          }
        }
        return throwError(err)
      })
    );
  }
}
