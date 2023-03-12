import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Trip } from '../../models/trip';

@Injectable({
  providedIn: 'root',
})
export class DbTripsService {
  private dbPath = '/trips';
  tripsRef: AngularFireList<Trip>;
  constructor(private db: AngularFireDatabase) {
    this.tripsRef = db.list(this.dbPath);
  }

  createTripInDB(trip: Trip): void {
    this.tripsRef.push(trip);
  }

  updateTripInDB(key: string, value: any) {
    console.log(key)
    return this.tripsRef.update(key, value);
  }

  deleteTripFromDB(key: string): Promise<void> {
    console.log(key)
    return this.tripsRef.remove(key);
  }

  getTripsFromDB() {
    return this.tripsRef;
  }

  deleteAllTripsFromDB() {
    this.tripsRef.remove();
  }
}
