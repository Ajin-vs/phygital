import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppserviceService } from '../appservice.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  display: boolean = false;
  sign:boolean = false;
  signUpForm:FormGroup = new FormGroup({});
  constructor(private router : Router,private authService : AuthService, private appService: AppserviceService) {}

  ngOnInit() {
   this.signUpForm=new FormGroup({
    mobile: new FormControl(null,Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required)
   })

   let val: any = localStorage.getItem('isUserLoggedIn');
    console.log(val);
    
    if(val != null && val == "true"){
          this.router.navigate(['/home']);
    }
  }
  public signUp(){  
    // this.display = true

    if(this.signUpForm.valid){
      this.sign = true;
      this.authService.signUp().subscribe(res=>{
        this.appService.register(this.signUpForm.controls['mobile'].value,this.signUpForm.controls['firstName'].value,this.signUpForm.controls['lastName'].value,res.my_wallet.classicAddress,'ACTIVE').subscribe(acct=>{
       console.log(acct);
       
          localStorage.setItem('isUserLoggedIn', true ? "true" : "false"); 
          let sender ={
            mobile:this.signUpForm.controls['mobile'].value,
            userId:acct.userId,
            pSeed:res.my_wallet.seed,
            publicKey:res.my_wallet.classicAddress,
            firstName:this.signUpForm.controls['firstName'].value,
            lastName: this.signUpForm.controls['lastName'].value
          }
          localStorage.setItem('sender', JSON.stringify(sender));
          this.sign = false;
          this.router.navigateByUrl('/home');
        })

       
      })
    }else{
      console.log("invalid form");
      
    }
  }
  public submitOtp(){
    // this.display = false;
    this.router.navigateByUrl('/demographicDetails')
  }
}
