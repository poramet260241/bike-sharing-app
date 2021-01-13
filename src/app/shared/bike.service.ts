import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import { Bike } from '../shared/bike';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  bikes: AngularFireList<Bike>;
  bikeDetail: AngularFireObject<Bike>;

  constructor(
      private database: AngularFireDatabase
  ) { }

  getAllBike(): AngularFireList<Bike> {
    this.bikes = this.database.list('/bikes') as AngularFireList<Bike>;
    return this.bikes;
  }
}
