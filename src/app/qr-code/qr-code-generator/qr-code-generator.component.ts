import { Component } from '@angular/core';

@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent {
  public myAngularxQrCode: string ='';
  constructor(){}

  ngOnInit(){
    this.myAngularxQrCode = 'Ajin&9633256745&12132323&Mscd12';
  }
 

}
