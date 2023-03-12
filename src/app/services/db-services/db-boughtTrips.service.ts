import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { BoughtTrip } from '../../models/boughtTrip';


@Injectable({
  providedIn: 'root',
})
export class DbBasketService {
  private dbPath = '/boughtTrips';
  boughtTripsRef: AngularFireList<BoughtTrip>;
  constructor(private db: AngularFireDatabase) {
    this.boughtTripsRef = db.list(this.dbPath);
  }

  createTripInDB(trip: BoughtTrip): void {
    const newDate = this.formatDate(new Date(trip.buyDate));
    const newTrip: BoughtTrip = new BoughtTrip(
      trip.name,
      trip.destination,
      trip.startDate,
      trip.endDate,
      trip.unitPrice,
      trip.imgLink,
      newDate,
      trip.amount
    );
    this.boughtTripsRef.push(newTrip);
  }

  getTripsFromDB() {
    return this.boughtTripsRef;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }
}
