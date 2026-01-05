import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base-services';
import { IAccount, IAccountUpdate } from '../moduels/model/common-model';


const TRANSACTION_API = environment.apiBaseUrl + '/api/v1/transactions';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService {

  constructor(private http: HttpClient) {
    super()
  }



  fetchPagedTransactions(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = TRANSACTION_API + '/statement/page' + param
    return this.http.get(url, httpOptions);
  }

  findTransactionById(id: number): Observable<any> {
    let url = `${TRANSACTION_API}/${id}`;
    return this.http.get(url, httpOptions);
  }

  fetchTransactionList(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = TRANSACTION_API + '/statement/list' + param
    return this.http.get(url, httpOptions);
  }


  submitTransaction(payload: IAccount): Observable<any> {
    let url = TRANSACTION_API;
    return this.http.post(url, payload, httpOptions);
  }

  updateTransaction(id:number, payload: IAccountUpdate): Observable<any> {
    let url = TRANSACTION_API+`/${id}`;
    return this.http.put(url, payload, httpOptions);
  }

}
