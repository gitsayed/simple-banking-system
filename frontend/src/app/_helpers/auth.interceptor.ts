import { HTTP_INTERCEPTORS,HttpHandler,
  HttpInterceptor,
  HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../_loader/loader.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenStorageService,
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
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
        }
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
