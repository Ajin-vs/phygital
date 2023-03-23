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
    this.myAngularxQrCode = 'Ajin|9633194654|12132323|Mscd12|Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ab, id optio itaque dolorem ipsam ullam odit aperiam cupiditate minus est, ipsa, accusamus neque praesentium quod hic reiciendis atque laboriosam!';
  }
 

}
