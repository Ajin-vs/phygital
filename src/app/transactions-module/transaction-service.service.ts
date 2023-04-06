import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceService {
  public domain ='http://192.168.29.187:3000'
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

  public getAccountInfo(pKey:any):Observable<any>{
    return this.httpClient.post(this.domain + '/getAccountInfo',{pKey})
  }

  public submitOfflineTx(signed:any):Observable<any>{
    return this.httpClient.post(this.domain +'/submitOfflineXrp',{signed:signed})
  }
  public sign():Observable<any>{
    return this.httpClient.get(this.domain +'/sign')
  }

  getOfflineTransactionHs= new Observable((observer)=>{
    Filesystem.readdir({path:'outbound',directory:Directory.Data}).then(res=>{
      observer.next(res.files);
    })
  })
  
}
