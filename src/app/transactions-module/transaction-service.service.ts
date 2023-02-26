import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceService {
  public domain ='http://192.168.129.122:3000'
  constructor(public httpClient: HttpClient) { }

  public getUser(number:number):Observable<any>{
    return this.httpClient.get(this.domain + '/getUser',{params:{number:number}})
  }
}
