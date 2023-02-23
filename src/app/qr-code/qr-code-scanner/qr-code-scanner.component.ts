import { Component } from '@angular/core';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent {
  public scanResult=''
  public scanSuccessHandler(event:string){
    this.scanResult = event
  }
}
