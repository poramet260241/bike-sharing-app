import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private currentUser: any;
    private username: any;

    constructor(
        private router: Router,
        private authentication: AngularFireAuth,
        private firestore: AngularFirestore,
        private database: AngularFireDatabase,
    ) {
        this.authentication.onAuthStateChanged((user) => {
            console.log('state changed');
            console.log(user);
            if (user) {
                this.currentUser = user;
                this.username = this.firestore.doc('users/' + user.uid);
            } else {
                this.currentUser = null;
            }
        }).then(r => {
        });
    }

    async SignUp(email: string, password: string){
        const credential = await  this.authentication.createUserWithEmailAndPassword(email, password);
        credential.user.updateProfile({
            displayName: 'Poramet Damyang',
            }).then();
        console.log('result: ' + credential);
    }

    SignIn(email, password) {
        return this.authentication.signInWithEmailAndPassword(email, password);
    }

    SignOut() {
        return this.authentication.signOut().then(() => {
            localStorage.removeItem('user');
            this.currentUser = null;
            this.router.navigate(['map'],{replaceUrl: true}).then(r => {
            });
        });
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null && user.emailVerified !== false) ? true : false;
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUsername() {
        return this.username;
    }
}
