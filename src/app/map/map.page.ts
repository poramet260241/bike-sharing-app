import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AuthenticationService} from '../shared/authentication.service';
import {Router} from '@angular/router';
import {BikeService} from '../shared/bike.service';
import {Bike} from '../shared/bike';
import {ViewChild, ElementRef} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {Plugins} from '@capacitor/core';

const { App } = Plugins;

declare var google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit, AfterViewInit{

    bikes: Bike[] = [];
    firstRead = false;
    map: any;
    @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

    infoWindows: any = [];
    markersArray: any = [];

    constructor(
        private bikeService: BikeService,
        private router: Router,
        public authenticationService: AuthenticationService,
        private platform: Platform,
        private alertController: AlertController,
    ) {
        this.platform.backButton.subscribeWithPriority(-1, () => {
            this.presentAlert();
        });
    }

    private readAllBike(){
        this.bikeService.getAllBike().snapshotChanges().subscribe(res => {
            this.bikes.length = 0;
            res.forEach(t => {
                const bike = t.payload.toJSON();
                bike[`$key`] = t.key;
                bike[`isChange`] = true;
                this.bikes.push(bike as Bike);
            });
            // console.log(this.bikes);
            console.log(this.bikes);
            this.addMarkersToMap(this.bikes);
        });
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
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay');
                        App.exitApp();
                    }
                }
            ]
        });
        await alert.present();
    }

    ngOnInit() {
        console.log('ngOnInit');
    }

    ionViewDidEnter(){
        console.log('ionViewDidEnter');
        this.readAllBike();
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
        this.showMap();
    }


    showMap(){
        const location = new google.maps.LatLng(7.007924490508865, 100.50050999922345);
        const options = {
            center: location,
            zoom: 16,
            disableDefaultUI: true,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        console.log('Show map');
    }

    addMarkersToMap(markers){
        for ( let i = 0; i < this.markersArray.length; i++){
            this.markersArray[i].setMap(null);
        }
        this.markersArray = [];
        console.log('length = ' + this.markersArray.length);
        for (const marker of markers){
            // console.log(marker);
            const location = new google.maps.LatLng(marker.latitude, marker.longitude);
            let mkIcon;
            if (marker.speed >= 0.5) {
                mkIcon = {
                    url: '../assets/app_marker/bike-marker-orange.png',
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 50)
                };
            }
            else {
                mkIcon = {
                    url: '../assets/app_marker/bike-marker-sky.png',
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 50)
                };
            }
            const mapMarker = new google.maps.Marker({
                position: location,
                title: marker.dev_id,
                speed: marker.speed,
                icon: mkIcon,
            });
            this.markersArray.push(mapMarker);
        }
        for ( let i = 0; i < this.markersArray.length; i++){
            if (this.markersArray[i].speed >= 0.5){
                if (this.authenticationService.getCurrentUser()){
                    this.markersArray[i].setMap(this.map);
                    this.addInfoWindowToMarker(this.markersArray[i]);
                }
            }
            else{
                this.markersArray[i].setMap(this.map);
                this.addInfoWindowToMarker(this.markersArray[i]);
            }
        }
    }

    floatBtnClick() {
        if (this.authenticationService.getCurrentUser()) {
            this.router.navigate(['user-detail']);
        } else {
            this.router.navigate(['app-login']);
        }
    }

    addInfoWindowToMarker(marker) {
        const infoWindow = new google.maps.InfoWindow({
            content: marker.title,
        });

        marker.addListener('click', () => {
            this.closeAllInfoWindow();
            infoWindow.open(this.map, marker);
        });

        this.infoWindows.push(infoWindow);
    }

    closeAllInfoWindow() {
        for (const window of this.infoWindows){
            window.close();
        }
    }
}
