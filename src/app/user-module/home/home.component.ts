import { Component } from '@angular/core';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  balance:number=0
  sender:any =sessionStorage.getItem('sender')
  constructor(private transationService : TransactionServiceService){

  }
  ngOnInit(){
    this.transationService.getBalance(JSON.parse(this.sender).pSeed).subscribe(data=>{
      this.balance = data.standby_balance
    })
  }
}
