import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {

  constructor(
      public authenticationService: AuthenticationService,
      private alertController: AlertController,
      private platform: Platform,
      private router: Router,
  ) {
      this.platform.backButton.subscribeWithPriority(10, () => {
    });
  }

  ngOnInit() {
    console.log('admin detail page');
    if (!this.authenticationService.getCurrentUser()) {
      this.router.navigate(['app-login']);
    }
    else{
      console.log(this.authenticationService.getCurrentUser().uid);
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sign Out',
      message: 'Do you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.authenticationService.SignOut();
          }
        }
      ]
    });

    await alert.present();
  }


}
