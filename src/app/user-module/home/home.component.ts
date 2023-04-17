import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import * as xrpl from "xrpl";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppserviceService } from 'src/app/appservice.service';
import { SpeedTestService } from 'ng-speed-test';
import { ConnectionService, ConnectionServiceOptions, ConnectionState } from 'ng-connection-service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public connectionStatus: boolean = false;
  // 

  balance: any = 0
  sender: any;
  justifyOptions: any[] = [];
  mode: any = "Online";
  sidebarVisible: boolean = false;
  visible = true;
  checked: boolean = false;
  blockedPanel = false;
  spinner = false;
  reciever = { mobile: 9654331234 }
  audio = new Audio("../../../assets/audio/success-1-6297.mp3");
  alertAudio = new Audio("../../../assets/audio/error-call-to-attention-129258.mp3");
  // netSpeed = 0;
  firstName: any;
  bal: boolean = true;
  status!: string;
  currentState!: ConnectionState;
  subscription = new Subscription();

  constructor(private connectionService: ConnectionService,private speedTestService: SpeedTestService, private transationService: TransactionServiceService, private appService: AppserviceService, private messageService: MessageService, private router: Router) {

    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'LOAN', value: 'MicroFinance' },
    ];


  }

  ngOnInit() {
    this.sender = localStorage.getItem('sender');
    this.firstName = JSON.parse(this.sender).firstName
    this.generateDirectory();

    this.subscription.add(
      this.connectionService.monitor().pipe(
        tap((newState: ConnectionState) => {
          this.currentState = newState;

          if (this.currentState.hasNetworkConnection) {
            this.status = 'ONLINE';
            this.connectionStatus = true;
            console.log(this.status);
            this.getNetSpeed();
            // },10000)
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
            
          } else {
            this.status = 'OFFLINE';
            console.log(this.status);
            this.connectionStatus = false;
            // this.netSpeed = 0;
            this.appService.netSpeed.next(0)
            this.balance = localStorage.getItem('balance');

          }
        })
      ).subscribe()
    );
    
    

    // orginal starts here
    // if (!this.appService.bio) {
    //   console.log("here");

    //   this.getBio().then(data => {
    //     this.appService.bio = true;
    //     localStorage.setItem('bio', 'true');
    //   }).catch(err => {
    //     console.log(err, "error data", err.error);
    //     console.log(JSON.stringify(err), "stringified")
    //     if (err.toString().includes("Error: Verification error")) {
    //       App.exitApp();
    //     }
    //     if (err.toString().includes("Error: Authentication failed")) {
    //       App.exitApp();
    //     }
    //   })
    // }
    // ends here
    // test starts here
    if (!localStorage.getItem('bio') || localStorage.getItem('bio') == 'false') {

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
            this.appService.bio = true;
            localStorage.setItem('bio', 'true');
            // resolve(true);
            // return true
          })
            .catch((err) => {
              console.log(err, "errr");
              if (err.toString().includes("Error: Verification error")) {
                App.exitApp();
              }
              if (err.toString().includes("Error: Authentication failed")) {
                App.exitApp();
              }
              // reject(err)
              // return false
            });
        }
        else {
          // reject('no bio')

        }
      })
    }
    // test ends 
    if ((localStorage.getItem('mode') === "MicroFinance") && localStorage.getItem('checked') == 'true') {
      this.checked = true;
    }

    // need to add inbound condition check


    //  network using capacitor
    Network.getStatus().then(status => {
      this.connectionStatus = status.connected
      if (!this.connectionStatus) {
        this.balance = localStorage.getItem('balance');
        // this.netSpeed = 0;
        this.appService.netSpeed.next(0)
      } else {
        this.getNetSpeed();
        Filesystem.readdir({
          path: '/outbound',
          directory: Directory.Data
        }).then(data => {
          if (!(data.files.length > 0)) {
            console.log("getSttusa lenght < 0 ", 12323);
            this.getBalance();
            this.getAccountInfo();
          }
          else {
            this.balance = localStorage.getItem('balance');
          }
        })
      }
    });

    // Network.addListener('networkStatusChange', status => {
    //   console.log("inside networkStatus Change", 12323);

    //   // this.getNetSpeed();
    //   this.connectionStatus = status.connected;
    //   if (this.connectionStatus) {
    //     // setInterval(()=>{
    //     this.getNetSpeed();
    //     // },10000)
    //     Filesystem.readdir({
    //       path: '/outbound',
    //       directory: Directory.Data
    //     }).then(data => {
    //       if (!(data.files.length > 0)) {
    //         this.getBalance();
    //         this.getAccountInfo();
    //       }
    //       else {
    //         this.balance = localStorage.getItem('balance');
    //       }
    //     }).catch(err => {
    //       // console.log("here",err);

    //       this.getBalance();
    //       this.getAccountInfo();
    //     })
    //     // this.getBalance();
    //   }
    //   else {
    //     this.netSpeed = 0;
    //     this.balance = localStorage.getItem('balance');
    //   }
    // });



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
  nextTransactions() {
    this.router.navigateByUrl('/home/loans')
  }
  // getBio() {
  //   let performBiometricVerificatin = new Promise<any>((resolve, reject) => {

  //     NativeBiometric.isAvailable().then(result => {
  //       if (result) {
  //         const isFaceID = result.biometryType == BiometryType.MULTIPLE;

  //         NativeBiometric.verifyIdentity({
  //           reason: "For easy log in",
  //           title: "Log in",
  //           subtitle: "Maybe add subtitle here?",
  //           description: "Maybe a description too?",
  //           useFallback: true,
  //           maxAttempts: 3

  //         }).then((res) => {
  //           console.log(res, "res true");

  //           resolve(true);
  //           // return true
  //         })
  //           .catch((err) => {
  //             console.log(err, "errr");
  //             reject(err)
  //             // return false
  //           });
  //       }
  //       else {
  //         reject('no bio')

  //       }
  //     })

  //   })
  //   return performBiometricVerificatin
  // }
  getNetSpeed() {
    try {
      this.speedTestService.getKbps(
        {
          iterations: 1,
          retryDelay: 10000,
        }
      ).subscribe(
        (speed) => {
          // this.netSpeed = speed;
          this.appService.netSpeed.next(speed)
          // console.log('Your speed is ' + speed);
        }
      )
    } catch (error) {
      console.log(error);

    }

  }
  payLender() {
    let tx = this.generateSignedTransaction(JSON.parse(this.sender).pSeed);
    let seq = Number(localStorage.getItem('sequence')) + 1
    // const client = new xrpl.Client(this.net)
    // client.connect().then(conn => {
    const standby_wallet = xrpl.Wallet.fromSeed(JSON.parse(this.sender).pSeed);
    console.log(standby_wallet, "wallet");

    // const operational_wallet = xrpl.Wallet.fromSeed(req.body.operationalSeedField)
    // const sendAmount = req.body.standbyAmountField
    // client.autofill({
    //   "TransactionType": "Payment",
    //   "Account": standby_wallet.address,
    //   "Amount": xrpl.xrpToDrops(this.amount),
    //   "Destination": JSON.parse(this.reciever).publicKey,
    //   "Sequence":seq,
    //   "LastLedgerSequence":99999999
    // }).then(prepared => {
    // console.log(prepared,"prepared");
    const signed: any = this.generateSignedTransaction(JSON.parse(this.sender).pSeed)
    // const  = standby_wallet.sign(prepared);
    let crtDate = new Date();

    Filesystem.writeFile({
      path: `outbound/${crtDate}|${JSON.stringify(this.reciever.mobile)}|'100'|'debit'|${JSON.stringify(JSON.parse(this.sender).mobile)}|'finace'.txt`,
      data: `${signed.tx_blob}|${JSON.stringify(this.reciever.mobile)}|'100'|'debit'|${JSON.stringify(JSON.parse(this.sender).mobile)}`,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    }).then(data => {
      localStorage.setItem('transaction', `${signed.tx_blob}|${JSON.stringify(this.reciever.mobile)}|'100'|'debit'|${JSON.stringify(JSON.parse(this.sender).mobile)}|'finance'`);
      // writeFile(`../../../outbound/${crtDate}.json`, 'Hello content!',()=>{})
      //need to implement balance reduction from localstorage
      localStorage.setItem('sequence', JSON.stringify(seq));
      let latestBalance = Number(localStorage.getItem('balance')) - 100
      localStorage.setItem('balance', JSON.stringify(latestBalance))
      this.router.navigateByUrl('/qrCode')
    })



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
    this.bal = false;
    this.transationService.getBalance(JSON.parse(this.sender).pSeed).subscribe(data => {
      this.balance = Math.trunc(data.standby_balance);
      // if(localStorage.getItem('balance')){

      // }else{
      localStorage.setItem('balance', JSON.stringify(this.balance))
      this.bal = true;
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
    // if (this.mode === 'MicroFinance') {
      this.sidebarVisible = true;
    // }
    // else {
    //   this.sidebarVisible = false;
    // }
  }


  getAccountInfo() {
    this.transationService.getAccountInfo(JSON.parse(this.sender).publicKey).subscribe(res => {
      let seq = res.message.result.account_data.Sequence - 1
      localStorage.setItem('sequence', JSON.stringify(seq))
    })
  }

  syncOfflineTx() {

    Filesystem.readdir({
      path: '/outbound',
      directory: Directory.Data
    }).then((data) => {
      console.log(data, "outbound");
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
                    setTimeout(() => {
                      this.getBalance();
                      this.getAccountInfo();
                    }, 5000);
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

  offlineTx(tx: string) {
    Filesystem.readdir({
      path: '/outbound',
      directory: Directory.Data
    }).then(data => {
      if (data.files.length > 0) {
        this.messageService.add({ severity: 'error', detail: 'Zync previous offline transaction before doing other.' });
        this.alertAudio.play();
      } else {
        if (tx == 'pay') {
          this.router.navigateByUrl('/qrCode/scanner')
        } else if (tx == 'recieve') {
          this.router.navigate(['/qrCode/scanner', { recieve: 'txReciver' }])
        }
      }
    })


  }



  async getInbound() {
    let inBoundFiles = await Filesystem.readFile({
      path: 'inbound',
      directory: Directory.Data
    })
    return inBoundFiles;
  }

  generateSignedTransaction(pSeed: any) {


    // Sample code demonstrating secure offline signing using xrpl.js library.
    const xrpl = require('xrpl')

    // Load seed value from an environment variable:
    const standby_wallet = xrpl.Wallet.fromSeed(pSeed)

    // For offline signing, you need to know your address's next Sequence number.
    // Alternatively, you could use a Ticket in place of the Sequence number.
    // This is useful when you need multiple signatures and may want to process transactions out-of-order.
    // For details, see: https://xrpl.org/tickets.html
    // let my_seq = 21404872

    // Provide *all* required fields before signing a transaction

    let seq = Number(localStorage.getItem('sequence')) + 1
    const txJSON = {
      "Account": standby_wallet.address,
      "TransactionType": "Payment",
      "Destination": 'rhMP1Pi7oMUrqBwosQbKFdrh8KVAkjiMPa',
      "Amount": xrpl.xrpToDrops(100),
      "Fee": "12",
      "Flags": 0,
      "Sequence": seq,
      "LastLedgerSequence": 99999999, // Optional, but recommended.
    }
    const signed = standby_wallet.sign(txJSON)
    return signed





  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
