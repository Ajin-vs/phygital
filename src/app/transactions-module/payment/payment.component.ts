import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TransactionServiceService } from '../transaction-service.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [MessageService]
})
export class PaymentComponent {
 
  display: boolean = false;
  display1:boolean = false;
  amount:number = 0
  cbdcPin:any;
  reciever:any;
  error:string =''
  transfered=false;
  sender:any = sessionStorage.getItem('sender')
  audio:any;
  mobile:any
  // {mobile:9748636760,pSeed:'sEdSFvqSN51N6PmrY2Zdqy6uJ51FfFn'};
  constructor(private transactionService : TransactionServiceService, private messageService: MessageService,private route :ActivatedRoute){

    
  }
 ngOnInit(){
  this.mobile = this.route.snapshot.paramMap.get('mobile');
  this.reciever = sessionStorage.getItem('reciever');
  this.transactionService.getUser(this.mobile).subscribe(data=>{
    this.reciever = JSON.stringify(data.user[0])
    console.log(this.reciever);
    
  })
 
  this.audio = new Audio("../../../assets/audio/success-1-6297.mp3");

 }
    showDialog() {
        this.display = true;
        
    }
    showDialog1(){
      this.display1 = true
    }
    hide(){
      console.log("herre");
    }
    validatePin(){
      this.transactionService.validatePin(JSON.parse(this.sender).mobile,this.cbdcPin).subscribe(data=>{
        if(data?.message == 'Invalid Pin'){
          this.error = data.message;
        }      
        else{
          this.error = '';
          this.display1 =false;
          this.transfered = true;
          this.transactionService.sendXrp(JSON.parse(this.sender).pSeed,this.amount,JSON.parse(this.reciever).publicKey).subscribe(data=>{
          if(data.tx_balance){
            this.messageService.add({severity:'success', summary: 'Success', detail: 'XRP Transfered Successfully'});
            this.audio.play();

          }            
            this.cbdcPin=null;
            this.transfered = false;
            this.display = false;
            this.amount=0
          })
        } 
      })
    }
    
    showSuccess() {
  }
    // validatePin(mobile:number,cbdcPin:number)
}
