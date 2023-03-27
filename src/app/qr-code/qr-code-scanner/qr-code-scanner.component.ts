import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent {
  public scanResult=''
  scannerEnabled:boolean=false;
  constructor(private router : Router){

  }
  ngOnInit(){
    this.scannerEnabled = true;

  }
  scanCompleteHandler(event:any){
    
  }
  public scanSuccessHandler(event:string){
    this.scanResult = event
    let reciver = {
      mobile:this.scanResult.split('|')[1],
      name:this.scanResult.split('|')[0],
      publicKey:this.scanResult.split('|')[2]

    }
    localStorage.setItem('reciever',JSON.stringify(reciver))
    // if(!localStorage.getItem('mode') || localStorage.getItem('mode') == 'Online'){
    //   this.router.navigate(['/transaction/payment'])    
    // }

    // else if(localStorage.getItem('mode') && localStorage.getItem('mode')==='Offline'){
    //   // let mobile = this.scanResult.split('|')
    // }
    this.router.navigate(['/transaction/payment'])    
    this.scannerEnabled = false;
  }

  ngOnDestroy(){
    this.scannerEnabled = false
  }
}
