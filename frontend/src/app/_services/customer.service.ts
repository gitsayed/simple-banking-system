import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base-services';
import { ICustomer, Role } from '../moduels/model/common-model';


const CUSTOMER_API = environment.apiBaseUrl + '/api/v1/customers';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  constructor(private http: HttpClient) {
    super()
  }



  fetchPagedCustomer(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = CUSTOMER_API + '/page' + param
    return this.http.get(url, httpOptions);
  }

  findCustomerById(id: number): Observable<any> {
    let url = `${CUSTOMER_API}/${id}`;
    return this.http.get(url, httpOptions);
  }

  fetchCustomerList(searchMap: Map<string, any>): Observable<any> {
    let param = this.mapToQueryString(searchMap);
    let url = CUSTOMER_API + '/list' + param
    return this.http.get(url, httpOptions);
  }


  createCustomer(payload: ICustomer): Observable<any> {
    let url = CUSTOMER_API;
    return this.http.post(url, payload, httpOptions);
  }

  updateCustomer(id:number, payload: ICustomer): Observable<any> {
    let url = CUSTOMER_API+`/${id}`;
    return this.http.put(url, payload, httpOptions);
  }

}
