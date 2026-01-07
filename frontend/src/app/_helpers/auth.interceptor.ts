import {
  HTTP_INTERCEPTORS, HttpHandler,
  HttpInterceptor,
  HttpRequest, HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../_loader/loader.service';
import { ToasterService } from '../_services/toaster.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenStorageService,
    private toast: ToasterService,
    private loaderService: LoaderService) { }

  private activeRequests = 0;


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.activeRequests++;

    const token = this.tokenService.getToken();

    const authReq = token
      ? req.clone({
        setHeaders: {
          "Authorization": `Bearer ${token}`
        }
      })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          this.toast.warning("session timeout.")
          this.logout();
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
        }
      })
    );
  }

  logout() {
    sessionStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
