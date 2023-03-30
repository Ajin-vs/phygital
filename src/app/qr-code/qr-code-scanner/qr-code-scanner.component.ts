import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent {
  public scanResult = ''
  scannerEnabled: boolean = false;
  sub: any = ''
  page: any = ''
  audio = new Audio("../../../assets/audio/success-1-6297.mp3");
  
  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService) {

  }
  ngOnInit() {
    this.scannerEnabled = true;
    this.sub = this.route.snapshot.paramMap.get('recieve');
    console.log(this.sub);

  }
  scanCompleteHandler(event: any) {

  }
  public scanSuccessHandler(event: string) {
    if ((!localStorage.getItem('mode') || localStorage.getItem('mode') === 'Online' || localStorage.getItem('mode') === 'Offline') && (this.sub !== 'txReciver')) {
      this.scanResult = event
      let reciver = {
        mobile: this.scanResult.split('|')[1],
        name: this.scanResult.split('|')[0],
        publicKey: this.scanResult.split('|')[2]

      }
      localStorage.setItem('reciever', JSON.stringify(reciver))
      // if(!localStorage.getItem('mode') || localStorage.getItem('mode') == 'Online'){
      //   this.router.navigate(['/transaction/payment'])    
      // }

      // else if(localStorage.getItem('mode') && localStorage.getItem('mode')==='Offline'){
      //   // let mobile = this.scanResult.split('|')
      // }
      this.router.navigate(['/transaction/payment'])
      this.scannerEnabled = false;
    }
    else if (localStorage.getItem('mode') === 'Offline' && this.sub === 'txReciver') {
      let sender:any = localStorage.getItem('sender');
      let crtDate = new Date();
      let recive = event.split('|');
      let path =''
      // console.log("here");
      
      // console.log(event);
     
      // console.log(`outbound/${crtDate}|${JSON.stringify(JSON.parse(recive[1]))}|${recive[2]}|'credit'.txt`,);
      Filesystem.writeFile({
        path: `outbound/${crtDate}|${JSON.stringify(JSON.parse(recive[1]))}|${recive[2]}|'credit'|${recive[3]}.txt`,
        data: event,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      }).then(res=>{
        let latestBalance =Number(localStorage.getItem('balance')) + Number(recive[2])
        localStorage.setItem('balance',JSON.stringify(latestBalance) );
        this.audio.play();
        this.messageService.add({ severity: 'success', detail: 'Transaction Completed' });
        this.router.navigate(['/home'])
      })
    }
    else if(localStorage.getItem('mode') == 'MicroFinance'){
      let crtDate = new Date();
      let recive = event.split('|');
      let path =''
      // console.log("here");
      
      // console.log(event);
     
      // console.log(`outbound/${crtDate}|${JSON.stringify(JSON.parse(recive[1]))}|${recive[2]}|'credit'.txt`,);
      Filesystem.writeFile({
        path: `outbound/${crtDate}|${JSON.stringify(JSON.parse(recive[1]))}|${recive[2]}|'credit'|${recive[3]}|'finance'.txt`,
        data: event,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      }).then(res=>{
        // let latestBalance =Number(localStorage.getItem('balance')) + Number(recive[2])
        // localStorage.setItem('balance',JSON.stringify(latestBalance) );
        this.audio.play();
        this.messageService.add({ severity: 'success', detail: 'Transaction Completed' });
        this.router.navigate(['/home'])
      })
    }
  }

  ngOnDestroy() {
    this.scannerEnabled = false
  }
}
