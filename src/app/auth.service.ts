import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public domain ='http://192.168.29.187:3000'
isUserLoggedIn: boolean = false;

  constructor(private httpClient: HttpClient) { }

// // login for current implementation
// public login(number:any,password:any):Observable<any>{
//    return this.httpClient.get(this.domain + '/getUser',{params:{number:number}})
//  }



   login(userName: any, password: string): Observable<any> {
      // console.log(userName);
      // console.log(password);
      // this.isUserLoggedIn = userName == 'admin' && password == 'admin';
      // localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false"); 
      return this.httpClient.post(this.domain + '/getAccount',{})
   // return of(this.isUserLoggedIn).pipe(
   //    delay(1000),
   //    tap(val => { 
   //       console.log("Is User Authentication is successful: " + val); 
   //    })
   // );
   }

   logout(): void {
   this.isUserLoggedIn = false;
      localStorage.removeItem('isUserLoggedIn'); 
   }

}
