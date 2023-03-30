import { Component } from '@angular/core';
import { BlockChainService } from '../block-chain.service';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent {
  public myAngularxQrCode: any ='';
  constructor(private blockChainService : BlockChainService, private router: Router){
    App.addListener('backButton', () => {
      this.router.navigateByUrl('/home');
    });
    
  }

  ngOnInit(){
    if(localStorage.getItem('mode') === 'Offline' &&  localStorage.getItem('transaction')){
      this.myAngularxQrCode = localStorage.getItem('transaction');      
    }
    else{
      let sender:any = localStorage.getItem('sender');
      this.myAngularxQrCode = `|${JSON.parse(sender).mobile}|${JSON.parse(sender).publicKey}|Mscd12`;
    }
  }
  
  ngOnDestroy(){
    localStorage.removeItem('transaction'); 
  }
}
