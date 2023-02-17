import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demographic-details',
  templateUrl: './demographic-details.component.html',
  styleUrls: ['./demographic-details.component.css']
})
export class DemographicDetailsComponent {
  constructor(private router : Router) {}

  ngOnInit() {
   
  }
  public onRegister(){
    this.router.navigateByUrl('/login')
  }
}
