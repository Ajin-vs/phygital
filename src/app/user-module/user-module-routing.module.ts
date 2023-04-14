import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoansComponent } from './loans/loans.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { UserParentComponent } from './user-parent/user-parent.component';

const routes: Routes = [
  { path: '', component: UserParentComponent,
  children:[
    {
      path:'',
      component:HomeComponent
    },
    {
      path:'loans',
      component:LoansComponent
    }
    ,{
    path:'history',
    component:TransactionHistoryComponent
  }]
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserModuleRoutingModule { }
