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
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { ScrollerModule } from 'primeng/scroller';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';

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
    SidebarModule,
    InputSwitchModule,
    AccordionModule,
    ScrollerModule,
    DialogModule,
    FormsModule,
    BlockUIModule
  ]
})
export class UserModuleModule { }
