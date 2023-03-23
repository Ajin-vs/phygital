import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModuleRoutingModule } from './user-module-routing.module';
import { HomeComponent } from './home/home.component';
import { UserParentComponent } from './user-parent/user-parent.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [
    HomeComponent,
    UserParentComponent,
    TransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    UserModuleRoutingModule,
    SelectButtonModule,
    FormsModule,
    AccordionModule,
    InputSwitchModule
  ]
})
export class UserModuleModule { }
