import { Component } from '@angular/core';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent {
  mode = localStorage.getItem('mode')
  sender: any = localStorage.getItem('sender')
  senderId = JSON.parse(this.sender).publicKey
  transactionDetails: any = [];
  offlineTransaction:any=[]
  RIPPLE_EPOCH_DIFF = 0x386d4380;

  constructor(private transactionService: TransactionServiceService) {

  }
  ngOnInit() {
    if(!localStorage.getItem('mode') || localStorage.getItem('mode') === 'Online'){
      this.mode ='Online'
      this.transactionService.getTxHistory(JSON.parse(this.sender).publicKey).subscribe(data => {
        console.log(data);
        this.transactionDetails = data.message.result.transactions
        console.log(this.transactionDetails);
        
      }, error => console.log('oops', error))
    }
    else if(this.mode === 'Offline'){
      this.transactionService.getOfflineTransactionHs.subscribe((data:any)=>{
        data.map((tx:any)=>{
          let name = JSON.stringify(tx.name).split("|");
          // console.log(name[],"d");
          if(name[5] === undefined){
            let tr ={
              date:name[0],
              mobile:name[1]==JSON.parse(this.sender).mobile? name[4]:name[1],
              amount:name[2],
              type: name[3].includes('debit')? 'debit':'credit'
            }
            this.offlineTransaction.push(tr);
          }
        
          // console.log(name);
          
        })
        // console.log(this.offlineTransaction);
        
      });
      // console.log("offlines",this.transactionService.getOfflineTransactionHs());
      
    }
    else if(this.mode === 'MicroFinance'){
      this.transactionService.getOfflineTransactionHs.subscribe((data:any)=>{
        data.map((tx:any)=>{
          let name = JSON.stringify(tx.name).split("|");
          // console.log(name[],"d");
          if(name[5] !== undefined){
            let tr ={
              date:name[0],
              mobile:name[1]==JSON.parse(this.sender).mobile? name[4]:name[1],
              amount:name[2],
              type: name[3].includes('debit')? 'debit':'credit'
            }
            this.offlineTransaction.push(tr);
          }
        
          // console.log(name);
          
        })
        // console.log(this.offlineTransaction);
        
      });
      // console.log("offlines",this.transactionService.getOfflineTransactionHs());
      
    }
    
  }

  public rippleTimeToISOTime(rippleTime: any) {
    return new Date(this.rippleTimeToUnixTime(rippleTime)).toISOString();
  }

  public rippleTimeToUnixTime(rpepoch: any) {
    return (rpepoch + this.RIPPLE_EPOCH_DIFF) * 1000;

  }

}
