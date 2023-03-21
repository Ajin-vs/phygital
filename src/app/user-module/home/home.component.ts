import { Component } from '@angular/core';
import { TransactionServiceService } from 'src/app/transactions-module/transaction-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  balance:number=0
  sender:any =sessionStorage.getItem('sender');
  justifyOptions: any[] =[];
  value3: any ="Online";
  constructor(private transationService : TransactionServiceService){
    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'MF', value: 'MicroFinance' },
    ];
  }
  ngOnInit(){
    this.transationService.getBalance(JSON.parse(this.sender).pSeed).subscribe(data=>{
      this.balance = data.standby_balance
    })
  }
}
