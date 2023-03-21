import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'phygital_ui';
  backEvent = 0;

  constructor(private router: Router) {

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
          App.exitApp();
        }
      }


      if (this.backEvent !== 2) {
        window.history.back();
      }

    })


    App.addListener('pause', () => {
      localStorage.removeItem("bio");
    })



  }


}
