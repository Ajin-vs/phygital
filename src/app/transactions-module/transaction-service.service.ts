import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceService {
  public domain ='http://localhost:3000'
  constructor(public httpClient: HttpClient) { }

  public getUser(number:number):Observable<any>{
    return this.httpClient.get(this.domain + '/getUser',{params:{number:number}})
  }

  public validatePin(mobile:number,cbdcPin:number):Observable<any>{
    return this.httpClient.get(this.domain +'/verifyPin',{params:{mobile:mobile,cbdcPin:cbdcPin}})
  }
  public sendXrp(standbySeedField:any,standbyAmountField:any,standbyDestinationField:any):Observable<any>{
    return this.httpClient.post(this.domain + '/sendXrp',{standbySeedField,standbyAmountField,standbyDestinationField} )
  }
  public getBalance(pSeed:string):Observable<any>{
    return this.httpClient.get( this.domain+'/balance',{params:{pSeed:pSeed}})
  }

  public getTxHistory(pKey:any):Observable<any>{
    return this.httpClient.get(this.domain + '/getTxRequest',{params:{pKey:pKey}})
  }

  public getAllEscrow(pKey:any):Observable<any>{
    return this.httpClient.get(this.domain + '/lookUpEscrow',{params:{pKey:pKey}})
  }

  public createEscrow(escrow:any,pSeed:any):Observable<any>{
    return this.httpClient.post(this.domain+'/createEscrow',{escrow,pSeed})
  }

  public cancelEscrow(pSeed:any, escrow:any):Observable<any>{
    return this.httpClient.post(this.domain+'/cancelEscrow',{escrow,pSeed})
  }
}
