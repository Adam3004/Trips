import { Injectable } from '@angular/core';
import { FilterTripsService } from './filter-trips.service';
import { Trip } from '../models/trip';
import { RatingOption } from '../models/ratingOptions';
import { map } from 'rxjs';
import { DbRatingService } from './db-services/db-rating.service';
import { BoughtTripsService } from './bought-trips.service';

@Injectable({
  providedIn: 'root',
})
export class RatingServiceService {
  listOfRating: RatingOption[] = [];
  tripsFromDB!: any[];

  constructor(
    private filterTrips: FilterTripsService,
    private dbRatingService: DbRatingService,
  ) {}

  private async getRatingFromDB() {
    return new Promise((resolve) => {
      this.dbRatingService
        .getRatingFromDB()
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
        .subscribe((data) => {
          this.tripsFromDB = data;
          this.listOfRating = this.tripsFromDB;
          return resolve(true);
        });
    });
  }

  async createListOfRating(len: number) {
    const resp = await this.getRatingFromDB();
    if (resp) {
      for (let i = 0; i < len - this.listOfRating.length; i++) {
        this.addNewTrip();
      }
      // console.log(this.listOfRating)
    }
  }

  addNewTrip(): void {
    const ratingForTrip = new RatingOption(0, 0, 0, []);
    this.listOfRating.push(ratingForTrip);
    this.dbRatingService.createRatingInDB(ratingForTrip);
  }

  removeTrip(index: number): void {
    this.listOfRating.splice(
      this.filterTrips.Trips.indexOf(this.filterTrips.TripsToDisplay[index]),
      1
    );
  }

  changeRating(
    index: number,
    value: number,
    rate: number,
    userID: string
  ): void {
    let newIndex;
    if (this.filterTrips.TripsToDisplay.length > 0) {
      newIndex = this.filterTrips.Trips.indexOf(
        this.filterTrips.TripsToDisplay[index]
      );
    } else {
      newIndex = index;
    }
    let currElem = this.listOfRating[newIndex];
    currElem.avg = value;
    currElem.sum += rate;
    currElem.numberOfOpinions += 1;
    if (!currElem.userKeys) {
      currElem.userKeys = [userID];
    } else {
      currElem.userKeys.push(userID);
    }
    this.dbRatingService.updateRatingInDB(
      this.listOfRating[newIndex].key!,
      this.listOfRating[newIndex]
    );
  }

  getRating(trip: Trip): number {
    return this.listOfRating[this.filterTrips.Trips.indexOf(trip)].avg;
  }

  getAvg(index: number): number {
    return this.listOfRating[
      this.filterTrips.Trips.indexOf(this.filterTrips.TripsToDisplay[index])
    ].avg;
  }

  getSum(index: number): number {
    return this.listOfRating[
      this.filterTrips.Trips.indexOf(this.filterTrips.TripsToDisplay[index])
    ].sum;
  }

  getNumberOfOpinions(index: number): number {
    return this.listOfRating[
      this.filterTrips.Trips.indexOf(this.filterTrips.TripsToDisplay[index])
    ].numberOfOpinions;
  }
}
