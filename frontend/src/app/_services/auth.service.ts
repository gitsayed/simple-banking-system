import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequestDto } from '../moduels/model/common-model';


const AUTH_API = environment.apiBaseUrl + '/api/v1/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(request: LoginRequestDto): Observable<any> {
    return this.http.post(
      AUTH_API + '/login', request, httpOptions
    );
  }

  register(request: any): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup', request, httpOptions
    );
  }


}
