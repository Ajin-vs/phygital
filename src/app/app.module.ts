import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {ButtonModule} from 'primeng/button';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemographicDetailsComponent } from './demographic-details/demographic-details.component';
import { HttpClientModule } from '@angular/common/http';
import { BlockChainCrudComponent } from './block-chain/block-chain-crud/block-chain-crud.component';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ForgetPasswordComponent,
    DemographicDetailsComponent,
    BlockChainCrudComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    BlockUIModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
