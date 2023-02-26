import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { SearchComponentComponent } from './search-component/search-component.component';

const routes: Routes = [
  {path:'',component:SearchComponentComponent},
  {path:'payment',component:PaymentComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsModuleRoutingModule { }
