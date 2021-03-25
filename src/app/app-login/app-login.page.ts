import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {AlertController} from '@ionic/angular';
import {NgForm} from '@angular/forms';


@Component({
    selector: 'app-app-login',
    templateUrl: './app-login.page.html',
    styleUrls: ['./app-login.page.scss'],
})
export class AppLoginPage implements OnInit {
    constructor(
        private router: Router,
        public authenticationService: AuthenticationService,
        private alertController: AlertController
    ) { }

    ngOnInit() {
        console.log('login-page');
        if (this.authenticationService.getCurrentUser()){
            this.router.navigate(['user-detail'], {replaceUrl: true}).then();
        }
        else{
            this.router.navigate(['app-login'], {replaceUrl: true}).then();
        }
    }

    async presentPasswordAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '',
            message: 'Incorrect email or password.',
            buttons: ['OK']
        });
        await alert.present();
    }

    // signUp() {
    //     this.authenticationService.SignUp(this.email, this.password);
    // }

    login(form: NgForm) {
        this.authenticationService.SignIn(form.value.email, form.value.password)
            .then((res) => {
                this.authenticationService.setCurrentUser(res.user);
                this.router.navigate(['map'], {replaceUrl: true}).then();
            }).catch(() => {
            this.presentPasswordAlert().then();
        });
    }
}
