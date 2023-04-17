import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { AppserviceService } from './appservice.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'phygital_ui';
  backEvent = 0;
  netSpeed =0;
  constructor(private router: Router, private appService: AppserviceService) {

    App.addListener('backButton', () => {

      if (this.router.url === '/home') {
        if (this.backEvent == 0) {
          Toast.show({
            text: 'Please click BACK again to exit!',
            duration: 'short'
          });
        }

        this.backEvent = this.backEvent + 1;
        setTimeout(() => {
          this.backEvent = 0;
        }, 2000);
        if (this.backEvent == 2) {
          appService.bio = false;
          localStorage.removeItem("bio");
          App.exitApp();
        }
      } else if (this.router.url.includes('/qrCode')) {
        router.navigate(['/home'])
      }
      else {
        window.history.back();
      }


      // if (this.backEvent !== 2) {

      // }

    })


    // App.addListener('pause', () => {
    //   appService.bio=false;
    //   localStorage.removeItem("bio");
    // })

    App.addListener('appStateChange', (res) => {
      if (!res.isActive) {
        appService.bio = false;
        localStorage.removeItem("bio");
      }

    })

    appService.netSpeed.subscribe(speed => {
      console.log(speed, "inservice");
      this.netSpeed = speed
    })
  }


}
