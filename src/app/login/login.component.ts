import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm:FormGroup=new FormGroup({})
  // sender:any ={mobile:9748636760,pSeed:'sEdSqU1ifnZaS11TDYdF2RUdhABJfHv',publicKey:'rfnnjz946BB1TBdDUHzyns2SaFQLhhyfFK'};
  constructor( private router : Router, private authService : AuthService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName :new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })
    let val: any = localStorage.getItem('isUserLoggedIn');
    console.log(val);
    
    if(val != null && val == "true"){
          this.router.navigate(['/home']);
    }
  }
  public login(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.controls['userName'].value,'admin').subscribe(res=>{
        localStorage.setItem('isUserLoggedIn', true ? "true" : "false"); 
        let sender ={
          mobile:this.loginForm.controls['userName'].value,
          pSeed:res.my_wallet.seed,
          publicKey:res.my_wallet.classicAddress
        }
        localStorage.setItem('sender', JSON.stringify(sender))
        this.router.navigateByUrl('/home');
      })
    }
   
  }
}
