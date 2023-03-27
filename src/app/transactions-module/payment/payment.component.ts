import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { TransactionServiceService } from '../transaction-service.service';

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
  mobile: any
  // {mobile:9748636760,pSeed:'sEdSFvqSN51N6PmrY2Zdqy6uJ51FfFn'};
  constructor(private router: Router ,private transactionService: TransactionServiceService, private confirmationService: ConfirmationService, private messageService: MessageService, private route: ActivatedRoute) {


  }
  ngOnInit() {
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
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        if(!localStorage.getItem('mode') || localStorage.getItem('mode') === 'Online'){
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
       else{
        this.router.navigateByUrl('/qrCode')
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
}
