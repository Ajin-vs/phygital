import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { AppserviceService } from './appservice.service';
import { SpeedTestService } from 'ng-speed-test';
import { Subscription, tap } from 'rxjs';
import { ConnectionService, ConnectionServiceOptions, ConnectionState } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'phygital_ui';
  backEvent = 0;
  netSpeed =0;
  subscription = new Subscription();
  crtDate = new Date();
  public connectionStatus: boolean = false;
  status!: string;
  currentState!: ConnectionState;
  constructor(private connectionService: ConnectionService,private router: Router, private appService: AppserviceService,private speedTestService: SpeedTestService) {
    this.getNetSpeed();

    this.subscription.add(
      this.connectionService.monitor().pipe(
        tap((newState: ConnectionState) => {
          this.currentState = newState;

          if (this.currentState.hasNetworkConnection) {
            this.status = 'ONLINE';
            this.connectionStatus = true;
            this.getNetSpeed();
          } else {
            this.status = 'OFFLINE';
            console.log(this.status);
            this.connectionStatus = false;
            // this.netSpeed = 0;
            this.appService.netSpeed.next(0)
          }
        })
      ).subscribe()
    );


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



  getNetSpeed() {
    try {
      this.speedTestService.getKbps(
        {
          iterations: 1,
          retryDelay: 10000,
        }
      ).subscribe(
        (speed) => {
          // this.netSpeed = speed;
          console.log(speed,"speeder");
          
          this.appService.netSpeed.next(speed)
          // console.log('Your speed is ' + speed);
        }
      )
    } catch (error) {
      console.log(error);

    }

  }

}
