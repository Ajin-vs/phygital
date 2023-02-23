import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrCodeGeneratorComponent } from './qr-code-generator/qr-code-generator.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';

const routes: Routes = [
  {path:'',component:QrCodeGeneratorComponent},
  {path:'scanner',component:QrCodeScannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeRoutingModule { }
