import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';
import { ConnectionService, ConnectionServiceOptions, ConnectionState } from 'ng-connection-service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as xrpl from 'xrpl'
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent {
  justifyOptions:any;
  mode:string = 'MicroFinance';
  loanId:any;
  loanrepaymenthistory:any;
  loanDetails:any
  loans:any = localStorage.getItem('loans');
  emi:any=0;
  subscription = new Subscription();
  crtDate = new Date();
  public connectionStatus: boolean = false;
  status!: string;
  currentState!: ConnectionState;
  alertAudio = new Audio("../../../assets/audio/error-call-to-attention-129258.mp3");
  displayModal=false
  validate=false
  sceduledAmt=0
  mfc ={
    mobile: 9400501678,
    mFPublickKey :'rseguVwgWkLTGoAw8HMqvvQ1G3ZZNRGKKZ'

  }
  sender: any = localStorage.getItem('sender')
  loanForm = new FormGroup({
    ind :new FormControl('',Validators.required),
    amount: new FormControl('',Validators.required)
  })
  constructor(private messageService: MessageService,private connectionService: ConnectionService,private router : Router, private transactionService: TransactionServiceService,   private route: ActivatedRoute){
    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'LOAN', value: 'MicroFinance' },
    ];
  }

  ngOnInit(){
    // Filesystem.readdir({
    //   path: 'loanData',
    //   directory: Directory.Data
    // }).then(data => { 
    //   console.log("data inside loanData",data);
      
    // })
    //   .catch(err => { Filesystem.mkdir({ path: 'loanData', directory: Directory.Data }) })



    this.loanDetails =JSON.parse(this.loans)
    this.loanId = this.route.snapshot.paramMap.get('loanId');
    localStorage.setItem('loanId',this.loanId)
    this.subscription.add(
      this.connectionService.monitor().pipe(
        tap((newState: ConnectionState) => {
          this.currentState = newState;
          if (this.currentState.hasNetworkConnection) {
            this.status = 'ONLINE';
            this.connectionStatus = true;  
            Filesystem.readdir({
              path: '/loanData',
              directory: Directory.Data
            }).then(data => {
              // console.log(data,"herer data");
              
              if (!(data.files.length > 0)) {
                console.log("herer");
                
                // this.getBalance();
                // this.getAccountInfo();
                this.transactionService.getLoanTenure(this.loanId).subscribe(tenure=>{
                  this.loanrepaymenthistory = tenure;
                  console.log(this.loanrepaymenthistory,"repayment history");
                  
                  if(this.loanrepaymenthistory.length > 0){                    
                    Filesystem.writeFile({
                      path: `loanData/${JSON.stringify(this.loanId)}.txt`,
                      data: JSON.stringify(this.loanrepaymenthistory),
                      directory: Directory.Data,
                      encoding: Encoding.UTF8
                    }).then(res=>{

                    }).catch(err=>{
                      console.log("error from write");
                      
                    })
                  }
                
                })
    
              }
              else {
                let lo:any = localStorage.getItem('loans');
                this.loans =JSON.parse(lo)
                this.readLoanFile(this.loanId);
               
                // this.balance = localStorage.getItem('balance');
              }
            }).catch(err => {
              console.log("here",err);

              // this.getBalance();
              // this.getAccountInfo();
            })

          } else {
            this.status = 'OFFLINE';
            console.log(this.status);
            this.connectionStatus = false;
            this.readLoanFile(this.loanId);
          }
        })
      ).subscribe()
    );
  
    
  }

  paid(method:any,ind:any,amt:any){
    this.sceduledAmt = amt
    if(method == null){ 
        this.displayModal= true
        this.loanForm.patchValue({amount:amt,ind:ind})
        console.log(this.loanForm.value);
        
    }
   else{
    console.log( "already paid",ind,amt)
   }
    
  }
  onSubmit(){
    let amt =this.loanForm.controls['amount'].value 
    let ind:any = this.loanForm.controls['ind'].value 
    if(Number(localStorage.getItem('balance')) < Number(amt)){
      console.log("insuffient balance");
      this.messageService.add({ severity: 'error', detail: 'Insuffient balance.' });
      this.alertAudio.play();
      
    }else{

    if(Number(this.loanForm.controls['amount'].value) !== this.sceduledAmt ){
      console.log( this.loanrepaymenthistory[this.loanrepaymenthistory.length-1]);
      
      this.loanrepaymenthistory[this.loanrepaymenthistory.length-1].id.scheduledEmi = -1;
    }
    
    console.log(this.loanForm.controls['amount'].value);
   
    let seq = Number(localStorage.getItem('sequence')) +1
    // const client = new xrpl.Client(this.net)
    // client.connect().then(conn => {
    const standby_wallet = xrpl.Wallet.fromSeed(JSON.parse(this.sender).pSeed);  
    const signed:any = this.generateSignedTransaction(JSON.parse(this.sender).pSeed,amt)
    // const  = standby_wallet.sign(prepared);
    let crtDate = new Date();
  
    // / let trx = `${signed.tx_blob|${}}`
  // localStorage.setItem('transaction', `${signed.tx_blob}|${}`);
  Filesystem.writeFile({
    path: `outbound/${crtDate}|${this.mfc.mobile}|${amt}|${JSON.parse(this.sender).mobile}|'finance' | .txt`,
    data: `${signed.tx_blob}|${this.mfc.mobile}|${amt}|${JSON.parse(this.sender).mobile}`,
    directory: Directory.Data,
    encoding: Encoding.UTF8
  }).then(res=>{
    localStorage.setItem('transaction', `${signed.tx_blob}|${this.mfc.mobile}|${amt}|${JSON.parse(this.sender).mobile}|'finance'`);
    localStorage.setItem('sequence',JSON.stringify(seq));
    let latestBalance =Number(localStorage.getItem('balance')) - Number(amt)
    localStorage.setItem('balance',JSON.stringify(latestBalance) )
    this.loanrepaymenthistory[ind].paymentMode = 'offline';
    this.loanrepaymenthistory[ind].id.scheduledEmi = amt
    this.loanrepaymenthistory = [...this.loanrepaymenthistory]
    Filesystem.writeFile({
      path: `loanData/${JSON.stringify(this.loanId)}.txt`,
      data: JSON.stringify(this.loanrepaymenthistory),
      directory: Directory.Data,
      encoding: Encoding.UTF8
    }).then(()=>{
      this.router.navigateByUrl('/qrCode')
    })
  })
}
  }
  generateSignedTransaction(pSeed:any,amt:any){
    

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
      "Destination":this.mfc.mFPublickKey,
      "Amount":xrpl.xrpToDrops(amt),
      "Fee":"12",
      "Flags":0,
      "Sequence": seq,
      "LastLedgerSequence":99999999, // Optional, but recommended.
    
    }
    console.log(txJSON,"transa");
    
    const signed = standby_wallet.sign(txJSON)
    return signed
    
    
    
    
    
  }


  readLoanFile(loanId:any){
    console.log("here read",loanId);
    
    Filesystem.readFile({
      path:`loanData/${JSON.stringify(loanId)}.txt`,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    }).then(data=>{
      // console.log("data",JSON.stringify(data));
      this.loanrepaymenthistory = JSON.parse( data.data)
    }).catch(err=>{
      console.log("error unknown file");
      
    })
  }
  changeMode(mode: string) {
    this.mode = mode;
    localStorage.setItem('mode', mode);
   
  }
  getDate(date:string,emiMonth:any){
    let actuallDat = new Date(date); 
    this.emi = emiMonth
    actuallDat.setMonth(actuallDat.getMonth()+this.emi)
   return actuallDat;
  }
  
}
