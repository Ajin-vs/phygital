import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  display: boolean = false;
  constructor(private router : Router) {}

  ngOnInit() {
   
  }
  public signUp(){  
    this.display = true
  }
  public submitOtp(){
    // this.display = false;
    this.router.navigateByUrl('/demographicDetails')
  }
}
