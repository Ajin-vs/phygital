import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  sender:any ={mobile:9748636760,pSeed:'sEdSFvqSN51N6PmrY2Zdqy6uJ51FfFn',publicKey:'rNyToJhc2fAFwx7g8tuD6cjQvtQPthGe7t'};
  constructor( private router : Router) {}

  ngOnInit() {
  }
  public login(){
    sessionStorage.setItem('sender', JSON.stringify(this.sender))
    this.router.navigateByUrl('/home');
  }
}
