import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base-services';
import { Role } from '../moduels/model/common-model';


const USER_API = environment.apiBaseUrl + '/api/v1/users';
const ROLE_API = environment.apiBaseUrl + '/api/v1/roles';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super()
  }


  fetchUserInfo(): Observable<any> {
    return this.http.get(USER_API + '/user-info', httpOptions);
  }

  fetchPagedUser(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = USER_API + '/page' + param
    return this.http.get(url, httpOptions);
  }

  findUserById(id: number): Observable<any> {
    let url = `${USER_API}/${id}`;
    return this.http.get(url, httpOptions);
  }

  fetchRoleList(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = ROLE_API + '/list' + param
    return this.http.get(url, httpOptions);
  }

  fetchPagedRoles(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = ROLE_API + '/page' + param
    return this.http.get(url, httpOptions);
  }

  createRole(payload: Role): Observable<any> {
    let url = ROLE_API;
    return this.http.post(url, payload, httpOptions);
  }

}
