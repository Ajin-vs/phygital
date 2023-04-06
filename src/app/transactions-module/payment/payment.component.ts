import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { TransactionServiceService } from '../transaction-service.service';
import * as xrpl from 'xrpl'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [MessageService]
})
export class PaymentComponent {

  display: boolean = false;
  display1: boolean = false;
  amount: number = 1
  cbdcPin: any;
  reciever: any;
  error: string = ''
  transfered = false;
  sender: any = localStorage.getItem('sender')
  audio: any;
  mobile: any;
  alertAudio = new Audio("../../../assets/audio/error-call-to-attention-129258.mp3");
  net = "wss://s.devnet.rippletest.net:51233"

  // {mobile:9748636760,pSeed:'sEdSFvqSN51N6PmrY2Zdqy6uJ51FfFn'};
  constructor(private router: Router, private transactionService: TransactionServiceService, private confirmationService: ConfirmationService, private messageService: MessageService, private route: ActivatedRoute) {


  }
  ngOnInit() {
   
    this.showSuccess();
    // this.mobile = this.route.snapshot.paramMap.get('mobile');
    this.reciever = localStorage.getItem('reciever');
    // if (this.mobile) {
    //   this.transactionService.getUser(this.mobile).subscribe(data => {
    //     this.reciever = JSON.stringify(data.user[0])
    //   })
    // }


    this.audio = new Audio("../../../assets/audio/success-1-6297.mp3");

  }
  showDialog() {
    this.display = true;

  }
  showDialog1() {
    this.display1 = true
  }
  hide() {
    console.log("herre");
  }
  submitXrp() {
    if(Number(localStorage.getItem('balance')) < this.amount){
      
      this.messageService.add({ severity: 'error', detail: 'Insufficient Balance.' });
      this.alertAudio.play();
    }
    else{
      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
          if (!localStorage.getItem('mode') || localStorage.getItem('mode') === 'Online') {
            this.transfered = true;
            this.transactionService.sendXrp(JSON.parse(this.sender).pSeed, this.amount, JSON.parse(this.reciever).publicKey).subscribe(data => {
              if (data.tx_balance) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'XRP Transfered Successfully' });
                this.audio.play();
                setTimeout(() => {
                  localStorage.removeItem('reciever')
                  this.router.navigateByUrl('/home')
                }, 1000);
              } else {
                this.messageService.add({ severity: 'error', summary: 'Failure', detail: 'XRP Transfered Failed' });
                this.audio.play();
              }
              // this.cbdcPin=null;
              this.transfered = false;
              this.display = false;
              this.amount = 1
            })
          }
          else {
           
  
            this.transfered = true;
            let seq = Number(localStorage.getItem('sequence')) +1
            // const client = new xrpl.Client(this.net)
            // client.connect().then(conn => {
              const standby_wallet = xrpl.Wallet.fromSeed(JSON.parse(this.sender).pSeed);  
              console.log(standby_wallet,"wallet");
              
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
                const signed:any = this.generateSignedTransaction(JSON.parse(this.sender).pSeed)
                // const  = standby_wallet.sign(prepared);
                let crtDate = new Date();
               
                Filesystem.writeFile({
                  path: `outbound/${crtDate}|${JSON.stringify(JSON.parse(this.reciever).mobile)}|${this.amount}|'debit'|${JSON.parse(this.sender).mobile}.txt`,
                  data: `${signed.tx_blob}|${JSON.stringify(JSON.parse(this.reciever).mobile)}|${this.amount}|${JSON.parse(this.sender).mobile}`,
                  directory: Directory.Data,
                  encoding: Encoding.UTF8
                }).then(data => {
                  console.log(data);
                  localStorage.setItem('transaction', `${signed.tx_blob}|${JSON.stringify(JSON.parse(this.reciever).mobile)}|${this.amount}|${JSON.parse(this.sender).mobile}|'phy'`);
                  // writeFile(`../../../outbound/${crtDate}.json`, 'Hello content!',()=>{})
                  this.transfered = false;
                  //need to implement balance reduction from localstorage
                  localStorage.setItem('sequence',JSON.stringify(seq));
                  let latestBalance =Number(localStorage.getItem('balance')) - this.amount
                  localStorage.setItem('balance',JSON.stringify(latestBalance) )
                  this.router.navigateByUrl('/qrCode')
                })
  
  
              // })
  
            // })
  
          }
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
        }
      });
    }
   
  }

  validatePin() {
    this.transactionService.validatePin(JSON.parse(this.sender).mobile, this.cbdcPin).subscribe(data => {
      if (data?.message == 'Invalid Pin') {
        this.error = data.message;
      }
      else {
        this.error = '';
        this.display1 = false;
        this.transfered = true;
        this.transactionService.sendXrp(JSON.parse(this.sender).pSeed, this.amount, JSON.parse(this.reciever).publicKey).subscribe(data => {
          if (data.tx_balance) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'XRP Transfered Successfully' });
            this.audio.play();

          }
          this.cbdcPin = null;
          this.transfered = false;
          this.display = false;
          this.amount = 0
        })
      }
    })
  }

  showSuccess() {
   

  }
  // validatePin(mobile:number,cbdcPin:number)


  generateSignedTransaction(pSeed:any){
    

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

let seq = Number(localStorage.getItem('sequence')) +1
const txJSON = {
  "Account": standby_wallet.address,
  "TransactionType":"Payment",
  "Destination":JSON.parse(this.reciever).publicKey,
  "Amount":xrpl.xrpToDrops(this.amount),
  "Fee":"12",
  "Flags":0,
  "Sequence": seq,
  "LastLedgerSequence":99999999, // Optional, but recommended.

}
console.log(txJSON,"transa");

const signed = standby_wallet.sign(txJSON)
return signed





  }
}
