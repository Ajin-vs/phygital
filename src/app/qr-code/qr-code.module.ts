import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrCodeRoutingModule } from './qr-code-routing.module';
import { QrCodeGeneratorComponent } from './qr-code-generator/qr-code-generator.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [
    QrCodeGeneratorComponent
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    ZXingScannerModule,
    QRCodeModule
  ]
})
export class QrCodeModule { }
