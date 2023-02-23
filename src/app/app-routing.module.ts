import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemographicDetailsComponent } from './demographic-details/demographic-details.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path:'login', component: LoginComponent },
  { path:'signup', component:SignUpComponent},
  { path: 'demographicDetails', component:DemographicDetailsComponent},
  {path:'forgetPassword', component:ForgetPasswordComponent},
  {
    path: 'home',
    loadChildren: () => import('./user-module/user-module.module').then(m => m.UserModuleModule)
  },
  { path: 'qrCode',  loadChildren: () => import('./qr-code/qr-code.module').then(m => m.QrCodeModule)},
  { path:'', redirectTo:'/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
