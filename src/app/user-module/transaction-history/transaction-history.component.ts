import { Component } from '@angular/core';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent {
  sender: any = sessionStorage.getItem('sender')
  senderId = JSON.parse(this.sender).publicKey
  transactionDetails: any = []
  RIPPLE_EPOCH_DIFF = 0x386d4380;

  constructor(private transactionService: TransactionServiceService) {

  }
  ngOnInit() {
    this.transactionService.getTxHistory(JSON.parse(this.sender).publicKey).subscribe(data => {
      console.log(data);
      this.transactionDetails = data.message.result.transactions
    }, error => console.log('oops', error))
  }

  public rippleTimeToISOTime(rippleTime: any) {
    return new Date(this.rippleTimeToUnixTime(rippleTime)).toISOString();
  }

  public rippleTimeToUnixTime(rpepoch: any) {
    return (rpepoch + this.RIPPLE_EPOCH_DIFF) * 1000;

  }

}
