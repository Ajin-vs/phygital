import { Component } from '@angular/core';
import { BlockChainService } from '../../qr-code/block-chain.service';
@Component({
  selector: 'app-block-chain-crud',
  templateUrl: './block-chain-crud.component.html',
  styleUrls: ['./block-chain-crud.component.css']
})
export class BlockChainCrudComponent {
  constructor(private blockChainService: BlockChainService) { }
  results = ''
  standbyAccountField = ''
  standbyPubKeyField = ''
  standbyPrivKeyField = ''
  standbyBalanceField = ''
  standbySeedField = ''
  standbyResultField = ''
  standbyDestinationField = ''
  standbyAmountField = ''
  seed = '';
  operationalSeedField=""
  ngOnInit() {
    // this.blockChainService.getConnection().subscribe(data => {
    //   console.log(data.message);

    // })

  }
  public getNet() {

    let net = "wss://s.devnet.rippletest.net:51233"
    // if (document.getElementById("tn")?.ariaChecked) net = "wss://s.altnet.rippletest.net:51233"
    // if (document.getElementById("dn")?.ariaChecked) net = "wss://s.devnet.rippletest.net:51233"
    return net
  }

  public getAccount(type: string) {
    let net = this.getNet()
    this.results = 'Connecting to ' + net + '....'
    this.blockChainService.getAccount(net).subscribe(data => {
      this.results += '\nGot a wallet.'
      this.setValue(data.my_wallet)
      this.standbyBalanceField = data.my_balance
      this.results += '\nStandby account created.'
      this.seed = data.my_wallet.seed;
    })

  }

  public setValue(data: any) {
    this.standbyAccountField = data.classicAddress;
    this.standbyPubKeyField = data.publicKey
    this.standbyPrivKeyField = data.privateKey
    this.standbySeedField = data.seed
  }

  public getAccountsFromSeeds() {
    let net = this.getNet()
    this.blockChainService.getAccountFromSeedes(net, this.seed).subscribe(data => {
      this.setValue(data.standby_wallet);
      this.standbyBalanceField = data.standby_balance
    })

  }

  // ******************** Send XRP *************************
  // *******************************************************
  
  public sendXRP() {
    let net = this.getNet();
    this.blockChainService.sendXrp(net,this.standbySeedField,this.standbyAmountField,this.operationalSeedField,this.standbyDestinationField).subscribe(data=>{
      console.log(data);
      
    })
  // results = "Connecting to the selected ledger.\n"
  // document.getElementById('standbyResultField').value = results
  

  // results += "\nConnected. Sending XRP.\n"
  

 

  // results += "\nstandby_wallet.address: = " + standby_wallet.address
  // document.getElementById('standbyResultField').value = results

  // ------------------------------------------------------- Prepare transaction
  // Note that the destination is hard coded.
  

  // ------------------------------------------------ Sign prepared instructions
  

  // results += "\nBalance changes: " +
  //   JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  // document.getElementById('standbyResultField').value = results

  // document.getElementById('standbyBalanceField').value =
  //   (await client.getXrpBalance(standby_wallet.address))
  // document.getElementById('operationalBalanceField').value =
  //   (await client.getXrpBalance(operational_wallet.address))

} // End of sendXRP()

}
