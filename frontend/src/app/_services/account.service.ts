import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base-services';
import { IAccount } from '../moduels/model/common-model';


const ACCOUNT_API = environment.apiBaseUrl + '/api/v1/accounts';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {

  constructor(private http: HttpClient) {
    super()
  }



  fetchPagedAccounts(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = ACCOUNT_API + '/page' + param
    return this.http.get(url, httpOptions);
  }

  findAccountById(id: number): Observable<any> {
    let url = `${ACCOUNT_API}/${id}`;
    return this.http.get(url, httpOptions);
  }

  fetchAccountList(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = ACCOUNT_API + '/list' + param
    return this.http.get(url, httpOptions);
  }


  createAccount(payload: IAccount): Observable<any> {
    let url = ACCOUNT_API;
    return this.http.post(url, payload, httpOptions);
  }

  updateAccount(id:number, payload: IAccount): Observable<any> {
    let url = ACCOUNT_API+`/${id}`;
    return this.http.put(url, payload, httpOptions);
  }

}
