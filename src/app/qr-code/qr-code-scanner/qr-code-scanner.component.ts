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
    let mobile = this.scanResult.split('|')[1]
    this.scannerEnabled = false;
    this.router.navigate(['/transaction/payment',{mobile:mobile}])    
  }

  ngOnDestroy(){
    this.scannerEnabled = false
  }
}
