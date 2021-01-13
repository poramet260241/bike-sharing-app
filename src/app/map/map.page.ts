import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AuthenticationService} from '../shared/authentication.service';
import {Router} from '@angular/router';
import {BikeService} from '../shared/bike.service';
import {Bike} from '../shared/bike';
import {ViewChild, ElementRef} from '@angular/core';

declare var google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})

export class MapPage implements OnInit, AfterViewInit{

    bikes: Bike[] = [];
    bikeTemp: Bike;
    firstRead = false;
    map: any;
    @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

    infoWindows: any = [];
    markersArray: any = [];

    constructor(
        private bikeService: BikeService,
        private router: Router,
        public authenticationService: AuthenticationService,
    ) { }

    private readAllBike(){
        this.markersArray = [];
        this.bikeService.getAllBike().snapshotChanges().subscribe(res => {
            this.bikes.length = 0;
            res.forEach(t => {
                const bike = t.payload.toJSON();
                // bike[`$key`] = t.key;
                // bike[`isChange`] = true;
                this.bikes.push(bike as Bike);
            });

            console.log(this.bikes);
            this.addMarkersToMap(this.bikes);
        });
    }

    findObject(mkArr, value): any{
        for (let i = 0; i < mkArr.length; i++){
            if (mkArr[i].title === value ){
                return mkArr[i];
            }
        }
        return null;
    }
    addMarkersToMap(bikes){
        bikes.forEach(bike => {
            // const found = this.markersArray.find( {title} === bike.dev_id);
            const found: any = this.findObject(this.markersArray, bike.dev_id);
            const location = new google.maps.LatLng(bike.latitude, bike.longitude);
            let mkIcon;
            let mkVisible: boolean;
            if (this.authenticationService.getCurrentUser()){
               mkVisible = true;
            }
            else {
                if (bike.speed >= 0.5){
                    mkVisible = false;
                }
                else{
                    mkVisible = true;
                }
            }
            console.log('bike in put is ' + bike);

            if (bike.speed >= 0.5) {
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
            console.log(found);
            if (found === null){
                console.log('found is null');
                const marker = new google.maps.Marker({
                    position: location,
                    title: bike.dev_id,
                    speed: bike.speed,
                    icon: mkIcon,
                    visible: mkVisible,
                });
                marker.setVisible(mkVisible);
                marker.setMap(this.map);
                this.addInfoWindowToMarker(marker);
                this.markersArray.push(marker);
                console.log('markerArray = ' + this.markersArray);
            }
            else {
                console.log('found data in object');
                found.setPosition(location);
                found.setIcon(mkIcon);
                found.setVisible(mkVisible);
            }
        });
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

    floatBtnClick() {
        if (this.authenticationService.getCurrentUser()) {
            this.router.navigate(['user-detail']);
        } else {
            this.router.navigate(['app-login']);
        }
    }

    closeAllInfoWindow() {
        for (const window of this.infoWindows){
            window.close();
        }
    }
}
