import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {ButtonModule} from 'primeng/button';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
