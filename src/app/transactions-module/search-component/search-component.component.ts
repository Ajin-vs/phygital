import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionServiceService } from '../transaction-service.service';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css']
})
export class SearchComponentComponent {
  mobileNumber:any;
  userDeatils:any=null;
  constructor( private transactionService: TransactionServiceService, private router : Router){}

  getShortName(fullName:string) { 
    return fullName.split(' ').map(n => n[0]).join('');
  }
  
  onPhoneNumber(){    
    if(this.mobileNumber.toString().length > 6){
      this.transactionService.getUser(this.mobileNumber).subscribe(data=>{
        this.userDeatils = data;
        // this.userDeatils = data.user
        // this.userDeatils.map((res:any)=>{
        //   this.getShortName(res.name)
        // })
       
      })
    }
    else{
      this.userDeatils = null;
    }

  }
  
  onPayment(){
    localStorage.setItem("reciever",JSON.stringify(this.userDeatils))
    this.router.navigateByUrl('/transaction/payment')
  }
}
