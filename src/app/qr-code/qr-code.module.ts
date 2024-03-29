import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { QrCodeRoutingModule } from './qr-code-routing.module';
import { QrCodeGeneratorComponent } from './qr-code-generator/qr-code-generator.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    QrCodeGeneratorComponent,
    QrCodeScannerComponent,
    
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    QRCodeModule,
    ToastModule,
    ZXingScannerModule
  ],
  providers: [MessageService]

})
export class QrCodeModule { }
