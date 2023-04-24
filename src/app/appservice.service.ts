import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {
  constructor(public httpClient: HttpClient) { }
  bio=false;
  netSpeed = new BehaviorSubject(0);
  public customerDomain ='http://15.206.203.178:8080'

  register(mobileNumber:any,firstName:any,lastName:any,publicKey:any,status:any):Observable<any>{
    return this.httpClient.post(`${this.customerDomain}/api/mvp/customer/user`,{mobileNumber,lastName,firstName,publicKey,status})
  }
}
