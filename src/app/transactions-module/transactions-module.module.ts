import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionsModuleRoutingModule } from './transactions-module-routing.module';
import { SearchComponentComponent } from './search-component/search-component.component';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import {DialogModule} from 'primeng/dialog';
import { PayComponentComponent } from './pay-component/pay-component.component';
import {ToastModule} from 'primeng/toast';
import { AtmRequestComponent } from './atm-request/atm-request.component';
import {AccordionModule} from 'primeng/accordion';
import {ScrollerModule} from 'primeng/scroller';
import { ReactiveFormsModule } from '@angular/forms';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    SearchComponentComponent,
    PaymentComponent,
    PayComponentComponent,
    AtmRequestComponent,
  ],
  imports: [
    CommonModule,
    TransactionsModuleRoutingModule,
    FormsModule,
    DialogModule,
    ToastModule,
    AccordionModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ScrollerModule
  ],
  providers: [ConfirmationService,MessageService]
})
export class TransactionsModuleModule { }
