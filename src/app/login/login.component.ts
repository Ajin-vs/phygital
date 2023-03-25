import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  sender:any ={mobile:9748636760,pSeed:'sEdSqU1ifnZaS11TDYdF2RUdhABJfHv',publicKey:'rfnnjz946BB1TBdDUHzyns2SaFQLhhyfFK'};
  constructor( private router : Router, private authService : AuthService) {}

  ngOnInit() {
    let val: any = localStorage.getItem('isUserLoggedIn');
    console.log(val);
    
    if(val != null && val == "true"){
          this.router.navigate(['/home']);
    }
  }
  public login(){
    this.authService.login('admin','admin').subscribe(res=>{
      localStorage.setItem('sender', JSON.stringify(this.sender))
      this.router.navigateByUrl('/home');
    })
   
  }
}
