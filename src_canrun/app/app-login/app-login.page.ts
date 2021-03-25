import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-app-login',
    templateUrl: './app-login.page.html',
    styleUrls: ['./app-login.page.scss'],
})
export class AppLoginPage implements OnInit {
    public email;
    public password;

    constructor(
        private router: Router,
        public authenticationService: AuthenticationService,
        private alertController: AlertController
    ) {
    }

    ngOnInit() {
        console.log('login-page');
    }

    logIn() {
        this.authenticationService.SignIn(this.email, this.password)
            .then((res) => {
                this.authenticationService.setCurrentUser(res.user);
                this.router.navigate(['map'],{replaceUrl: true});
            }).catch(err => {
                this.presentPasswordAlert();
        });
    }

    async presentPasswordAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            message: 'Email or password wrong !.',
            buttons: ['OK']
        });

        await alert.present();
    }

    signUp() {
        this.authenticationService.SignUp(this.email, this.password);
    }
}
