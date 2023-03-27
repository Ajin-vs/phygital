import { Component } from '@angular/core';
import { BlockChainService } from '../block-chain.service';

@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent {
  public myAngularxQrCode: string ='';
  constructor(private blockChainService : BlockChainService){}

  ngOnInit(){
    this.myAngularxQrCode = 'Ajin|9633194654|r4aa7XbH8PUyHGC9zHnXJ9vDBdpUd2Ak4G|Mscd12';
  }
 

}
