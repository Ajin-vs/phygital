import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionsModuleRoutingModule } from './transactions-module-routing.module';
import { SearchComponentComponent } from './search-component/search-component.component';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import {DialogModule} from 'primeng/dialog';
import { PayComponentComponent } from './pay-component/pay-component.component';

@NgModule({
  declarations: [
    SearchComponentComponent,
    PaymentComponent,
    PayComponentComponent
  ],
  imports: [
    CommonModule,
    TransactionsModuleRoutingModule,
    FormsModule,
    DialogModule
  ]
})
export class TransactionsModuleModule { }
