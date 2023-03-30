import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import * as xrpl from "xrpl";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public connectionStatus: boolean = false;
  // 
  balance: any = 0
  sender: any = localStorage.getItem('sender');
  justifyOptions: any[] = [];
  mode: any = "Online";
  sidebarVisible: boolean = false;
  visible = true;
  checked: boolean = false;
  blockedPanel = false;
  spinner = false;
  audio = new Audio("../../../assets/audio/success-1-6297.mp3");
  alertAudio = new Audio("../../../assets/audio/error-call-to-attention-129258.mp3")
  constructor(private transationService: TransactionServiceService, private messageService: MessageService, private router: Router) {
    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'LOAN', value: 'MicroFinance' },
    ];

  }

  ngOnInit() {
    this.generateDirectory();

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
    // need to add inbound condition check


    //  network using capacitor
    Network.getStatus().then(status => {
      this.connectionStatus = status.connected
      if (!this.connectionStatus) {
        this.balance = localStorage.getItem('balance');
      } else {
        Filesystem.readdir({
          path: '/outbound',
          directory: Directory.Data
        }).then(data => {
          if (!(data.files.length > 0)) {
            this.getBalance();
            this.getAccountInfo();
          }
          else {
            this.balance = localStorage.getItem('balance');
          }
        }).catch(err => {
          // console.log("here",err);

          this.getBalance();
          this.getAccountInfo();
        })
      }
    });

    Network.addListener('networkStatusChange', status => {
      this.connectionStatus = status.connected;
      if (this.connectionStatus) {
        Filesystem.readdir({
          path: '/outbound',
          directory: Directory.Data
        }).then(data => {
          if (!(data.files.length > 0)) {
            this.getBalance();
            this.getAccountInfo();
          }
          else {
            this.balance = localStorage.getItem('balance');
          }
        }).catch(err => {
          // console.log("here",err);

          this.getBalance();
          this.getAccountInfo();
        })
        // this.getBalance();
      }
      else {
        this.balance = localStorage.getItem('balance');
      }
    });


    if (localStorage.getItem('checked') && this.mode === 'MicroFinance') {
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
    // this.getBalance();
  }
  payLender(){
    
  }
  onlineSend(btn: string) {
    if (!this.connectionStatus) {
      this.messageService.add({ severity: 'error', detail: 'No internet connection.' });
      this.alertAudio.play();
    }
    else if (this.connectionStatus) {
      Filesystem.readdir({
        path: '/outbound',
        directory: Directory.Data
      }).then(data => {
        if (data.files.length > 0) {
          this.messageService.add({ severity: 'error', detail: 'Zync all offline transaction before doing Online.' });
          this.alertAudio.play();
        }
        else {
          if (btn === 'send') {
            this.router.navigateByUrl('/transaction');
          }
          else if (btn === 'atmRequest') {
            this.router.navigateByUrl('/transaction/atmRequest');
          }
          else if (btn === 'scanner') {
            this.router.navigateByUrl('/qrCode/scanner');
          }
        }
      }).catch(err => {
        if (btn === 'send') {
          this.router.navigateByUrl('/transaction');
        } else if (btn === 'atmRequest') {
          this.router.navigateByUrl('/transaction/atmRequest');
        } else if (btn === 'scanner') {
          this.router.navigateByUrl('/qrCode/scanner');
        }
      })

    }
  }
  generateDirectory() {
    Filesystem.readdir({
      path: 'outbound',
      directory: Directory.Data
    }).then(data => { })
      .catch(err => { Filesystem.mkdir({ path: 'outbound', directory: Directory.Data }) });
    Filesystem.readdir({
      path: 'inbound',
      directory: Directory.Data
    }).then(data => { })
      .catch(err => { Filesystem.mkdir({ path: 'inbound', directory: Directory.Data }) })
  }
  getBalance() {
    this.transationService.getBalance(JSON.parse(this.sender).pSeed).subscribe(data => {
      this.balance = Math.trunc(data.standby_balance);
      // if(localStorage.getItem('balance')){

      // }else{
      localStorage.setItem('balance', JSON.stringify(this.balance))
      // }
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
    if ((this.mode === "MicroFinance") && localStorage.getItem('checked') == 'true') {
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

  getAccountInfo() {
    this.transationService.getAccountInfo(JSON.parse(this.sender).publicKey).subscribe(res => {
      let seq = res.message.result.account_data.Sequence - 1
      localStorage.setItem('sequence', JSON.stringify(seq))
    })
  }

  syncOfflineTx() {
    // let inBound =  await this.getInbound();
    // console.log(inBound,"here");
    
    Filesystem.readdir({
      path: '/outbound',
      directory: Directory.Data
    }).then((data) => {
      console.log(data,"outbound");
      if (!(data.files.length > 0)) {
        this.messageService.add({ severity: 'error', detail: 'There are No offline transactions to zync' });
        this.alertAudio.play();
      }
      else {
        if (this.connectionStatus) {

          this.spinner = true;
          let lastEle = data.files.length - 1
          data.files.map((transactions, index) => {
            Filesystem.readFile({
              path: `outbound/${transactions.name}`,
              directory: Directory.Data,
              encoding: Encoding.UTF8,
            }).then(data => {
              let res = JSON.stringify(data.data).split('|')[0];
              let signed = res.slice(1);
              this.transationService.submitOfflineTx(signed).subscribe(res => {
                Filesystem.deleteFile({
                  path: `outbound/${transactions.name}`,
                  directory: Directory.Data,
                }).then(dele => {
                  if (lastEle == index) {
                    this.audio.play();
                    this.messageService.add({ severity: 'success', detail: 'Offline transactions were synced' });
                    this.spinner = false;
                    this.getBalance();
                    this.getAccountInfo();
                  }
                })


              })
              // console.log(JSON.stringify(data.data).split('|')[0].slice(0,1));
            })
          })
        }
        else {
          this.messageService.add({ severity: 'error', detail: 'No internet connection.' });
        }
      }
    }
    )
      .catch(err => {
        this.messageService.add({ severity: 'error', detail: 'There are No offline transactions to zync' });
      })
  }

  recieveOfflineTx(){
    this.router.navigate(['/qrCode/scanner',{ recieve: 'txReciver' }])
  }


  async getInbound() {
    let inBoundFiles = await Filesystem.readFile({
      path: 'inbound',
      directory:Directory.Data
    })
    return inBoundFiles;
  }


}
