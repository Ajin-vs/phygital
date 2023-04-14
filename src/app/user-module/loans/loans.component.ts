import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent {
  justifyOptions:any;
  mode:string = 'MicroFinance';
  constructor(private router : Router){
    this.justifyOptions = [
      { label: 'ON', value: 'Online' },
      { label: 'OFF', value: 'Offline' },
      { label: 'LOAN', value: 'MicroFinance' },
    ];
  }

  changeMode(mode: string) {
    this.mode = mode;
    localStorage.setItem('mode', mode);
   
  }

 
}
