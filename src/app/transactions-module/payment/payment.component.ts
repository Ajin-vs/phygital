import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  display: boolean = false;
  display1:boolean = false;
    showDialog() {
        this.display = true;
    }

    showDialog1(){
      this.display1 = true
    }
    hide(){
      console.log("herre");
      
    }
}
