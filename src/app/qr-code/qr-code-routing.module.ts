import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrCodeGeneratorComponent } from './qr-code-generator/qr-code-generator.component';

const routes: Routes = [
  {path:'',component:QrCodeGeneratorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeRoutingModule { }
