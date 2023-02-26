import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlockChainService {
  public domain ='http://localhost:3000'
  constructor(public httpClient: HttpClient) { }

  public getConnection():Observable<any>{
    return this.httpClient.post(this.domain + '/',{name:"Ajin"})
  }

  public getAccount(net:string):Observable<any>{
    return this.httpClient.post(this.domain + '/getAccount',{net:net})
  }

  public getAccountFromSeedes(net:any,seeds:any):Observable<any>{
    return this.httpClient.post(this.domain + '/getAccountFromSeeds',{net,seeds})
  }

  public sendXrp(net:any,standbySeedField:any,standbyAmountField:any,operationalSeedField:any,standbyDestinationField:any):Observable<any>{
    return this.httpClient.post(this.domain + '/sendXrp',{net,standbySeedField,standbyAmountField,operationalSeedField,standbyDestinationField} )
  }
}
