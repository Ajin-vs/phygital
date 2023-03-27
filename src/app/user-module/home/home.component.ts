import { ChangeDetectionStrategy, Component,DoCheck } from '@angular/core';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';
import { App } from '@capacitor/app';
import { Observable } from 'rxjs';
import * as xrpl from "xrpl";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  balance: number = 0
  sender: any = localStorage.getItem('sender');
  justifyOptions: any[] = [];
  mode: any = "Online";
  sidebarVisible: boolean = false;
  visible = true;
  checked: boolean = false;

  blockedPanel= false
  constructor(private transationService: TransactionServiceService) {
    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'LOAN', value: 'MicroFinance' },
    ];

  }
  ngOnInit() {


    if (!localStorage.getItem("bio")) {
      this.getBio().then(data => {
        localStorage.setItem('bio', 'true');
      }).catch(err => {
        console.log(err, "error data", err.error);
        console.log(JSON.stringify(err), "stringified")
        if (err.toString().includes("Error: Verification error")) {
          App.exitApp();
        }
        if (err.toString().includes("Error: Authentication failed")) {
          App.exitApp();
        }
      })
    }
    if (localStorage.getItem('checked')) { 
      this.checked = true; 
    }
    if (localStorage.getItem('mode')) this.mode = localStorage.getItem('mode');
    // if(!localStorage.getItem("bio")){
    //   this.performBiometricVerificatin.then((verified)=>{
    //     localStorage.setItem('bio','true')
    //     console.log(verified,"verified");
    //   }).catch((err)=>{
    //     console.log("internal err",err);

    //     if(err.includes( 'Verification error')){
    //       this.performBiometricVerificatin.then((verified)=>{
    //         localStorage.setItem('bio','true')
    //       }).catch(err=>{

    //         if(err.includes('Verification error')){
    //           App.exitApp();
    //         }
    //       })
    //     }
    //     // Authentication failed
    //   })

    // }
    this.transationService.getBalance(JSON.parse(this.sender).pSeed).subscribe(data => {
      this.balance = data.standby_balance
    })
  }

  
  changeTog() {
    if (this.checked) {
      localStorage.setItem('checked', 'true')

    }
    else {
      localStorage.removeItem('checked');
    }
  }
  changeMode(mode: string) {
    this.mode = mode;
    localStorage.setItem('mode', mode);
    this.checked = false;
    if((this.mode === "MicroFinance") && localStorage.getItem('checked')=='true'){
      this.checked = true;
    }
  }


//  async test(){
//     const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
//     await client.connect()
//      const faucetHost = ''
//      const standby_wallet = xrpl.Wallet.fromSeed("sEdSqU1ifnZaS11TDYdF2RUdhABJfHv");
//      const standby_balance = (await client.getXrpBalance(standby_wallet.address))

//      console.log(standby_balance);
     
//     return(standby_balance)
//     // res.status(200).send({ my_balance, my_wallet })
//   }



  sidebarVisibility() {
    if (this.mode === 'MicroFinance') {
      this.sidebarVisible = true;
    }
    else {
      this.sidebarVisible = false;
    }
  }
  getBio() {
    let performBiometricVerificatin = new Promise<any>((resolve, reject) => {

      NativeBiometric.isAvailable().then(result => {
        if (result) {
          const isFaceID = result.biometryType == BiometryType.MULTIPLE;

          NativeBiometric.verifyIdentity({
            reason: "For easy log in",
            title: "Log in",
            subtitle: "Maybe add subtitle here?",
            description: "Maybe a description too?",
            useFallback: true,
            maxAttempts: 3

          }).then((res) => {
            console.log(res, "res true");

            resolve(true);
            // return true
          })
            .catch((err) => {
              console.log(err, "errr");
              reject(err)
              // return false
            });
        }
        else {
          reject('no bio')

        }
      })

    })
    return performBiometricVerificatin
  }






}
