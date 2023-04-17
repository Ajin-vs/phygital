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
  register(mobileNumber:any,firstName:any,lastName:any,publicKey:any,status:any):Observable<any>{
    return this.httpClient.post('http://mvp-phygital-customer.ap-south-1.elasticbeanstalk.com/api/mvp/customer/user',{mobileNumber,lastName,firstName,publicKey,status})
  }
}
