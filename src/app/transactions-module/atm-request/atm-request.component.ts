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
  sender:any = localStorage.getItem('sender')
  validEscrow :any =[]
  escrow:any=null;
  validate = false;
  audio = new Audio("../../../assets/audio/success-1-6297.mp3");
  alertAudio = new Audio("../../../assets/audio/error-call-to-attention-129258.mp3");
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
    if(this.validEscrow.length > 0){
      this.messageService.add({severity:'error', detail: 'One Request is Pending...'});
      this.alertAudio.play()
    }else{
      this.displayModal = true
    }
    
  }
  onSubmit(){
    if(this.escrowForm.valid){
      if(Number(localStorage.getItem('balance'))< Number(this.escrowForm.controls['amount'].value)){
        this.messageService.add({severity:'error', detail: `Insufficient balance`});
        this.alertAudio.play()
      }
      else{
        this.validate = true
        // localStorage.setItem("escrow",JSON.stringify(this.escrowForm.value))
        this.transactionService.createEscrow(this.escrowForm.value,JSON.parse(this.sender).pSeed).subscribe(data=>{
          this.escrow ={...this.escrowForm.value,sequence:data.Sequence}
          localStorage.setItem("escrow",JSON.stringify(this.escrow));
          this.getEscrow();
          this.displayModal = false;
          this.validate = false;
          this.audio.play();
          this.messageService.add({severity:'success', detail: `Escrow created with sequence number ${data.Sequence}`});
  
        })
      }
    
    }
    else{

    }
    

  }
 
  onCancelEscrow() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to cancel this request?',
        accept: () => {          
          this.transactionService.cancelEscrow(JSON.parse(this.sender).pSeed,this.escrow).subscribe(data=>{
            console.log(data.meta.TransactionResult);
            
            if(data.meta.TransactionResult.includes('tecNO_PERMISSION') || data.meta.TransactionResult.includes("tecNO_TARGET")){
              this.messageService.add({severity:'error', detail: data.meta.TransactionResult});
              this.alertAudio.play()
            }
           
            else{
              this.messageService.add({severity:'success', detail: 'Atm withdrawal request is cancelled.'});
              this.getEscrow();
              this.audio.play();
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
