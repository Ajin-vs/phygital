import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionServiceService } from '../transaction-service.service';

@Component({
  selector: 'app-atm-request',
  templateUrl: './atm-request.component.html',
  styleUrls: ['./atm-request.component.css']
})
export class AtmRequestComponent {
  sender:any = sessionStorage.getItem('sender')
  validEscrow :any =[]
  escrow:any=null;
  audio = new Audio("../../../assets/audio/success-1-6297.mp3");
  escrowForm = new FormGroup({
    otp :new FormControl('',Validators.required),
    amount: new FormControl(null,Validators.required)
  })
  constructor(private messageService: MessageService,private transactionService: TransactionServiceService,private confirmationService: ConfirmationService){}
  ngOnInit(){
   this.getEscrow()
   let escrowS:any =localStorage.getItem('escrow')
   if(JSON.parse(escrowS)){    
    this.escrow = JSON.parse(escrowS)
   }
  }
  displayModal=false
  onNewRequest(){
    this.displayModal = true
  }
  onSubmit(){
    if(this.escrowForm.valid){
      
      // localStorage.setItem("escrow",JSON.stringify(this.escrowForm.value))
      this.transactionService.createEscrow(this.escrowForm.value,JSON.parse(this.sender).pSeed).subscribe(data=>{
        this.escrow ={...this.escrowForm.value,sequence:data.Sequence}
        localStorage.setItem("escrow",JSON.stringify(this.escrow));
        this.getEscrow();
        this.displayModal = false;
        this.audio.play();
        this.messageService.add({severity:'success', detail: `Escrow created with sequence number ${data.Sequence}`});

      })
    }
    else{

    }
    

  }
 
  onCancelEscrow() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to cancel this request?',
        accept: () => {          
          this.transactionService.cancelEscrow(JSON.parse(this.sender).pSeed,this.escrow).subscribe(data=>{
            this.audio.play();
            this.messageService.add({severity:'error', detail: data.meta.TransactionResult});
           
            if( data.meta.TransactionResult !== "tesSUCCESS" ){
              this.getEscrow();
            }
          })
        }
    });}
  getEscrow(){
    this.transactionService.getAllEscrow(JSON.parse(this.sender).publicKey).subscribe((data)=>{
      this.validEscrow =data.result.account_objects        
    })
  }

}
