import { Injectable, OnInit } from '@angular/core';
import listOfTrips from '../listOfTrips.json';
import { BasketService } from './basket.service';
import { FilterTripsService } from './filter-trips.service';
import { RatingServiceService } from './rating-service.service';
import { ReservedTripsServiceService } from './reserved-trips-service.service';
import { Trip } from '../models/trip';
import { BoughtTripsService } from './bought-trips.service';
import { BoughtTrip } from '../models/boughtTrip';
import { DbTripsService } from './db-services/db-trips.service';
import { map } from 'rxjs';
import { OpinionsService } from './opinions.service';

@Injectable({
  providedIn: 'root',
})
export class ListOfTripsService {
  Trips: Trip[] = [];
  tripsFromDB: any;
  BookedPlaces: number[] = [];
  maxVal: number = 0;
  minVal: number = 0;
  tmpList: number[] = [];
  tmpListOfTrips: Trip[] = [];
  endDate?: Date;
  startDate?: Date;
  ChoosenLocations?: string[];
  numberOfUsage = 0;

  constructor(
    public reservedTrips: ReservedTripsServiceService,
    public tripsFilter: FilterTripsService,
    private rating: RatingServiceService,
    private basket: BasketService,
    private boughTripsService: BoughtTripsService,
    private dbTrips: DbTripsService,
    private opinionsService: OpinionsService
  ) {}

  mapToStartDate(list: Trip[]): Date[] {
    return list
      .map((trip: Trip) => {
        return trip.startDate;
      })
      .sort((a, b) => {
        return this.parseFuncion(a, b);
      });
  }

  parseFuncion(a: Date, b: Date): number {
    if (
      parseInt(a.toString().split('-')[0]) -
        parseInt(b.toString().split('-')[0]) !=
      0
    ) {
      return (
        parseInt(a.toString().split('-')[0]) -
        parseInt(b.toString().split('-')[0])
      );
    } else if (
      parseInt(a.toString().split('-')[1]) -
        parseInt(b.toString().split('-')[1]) !=
      0
    ) {
      return (
        parseInt(a.toString().split('-')[1]) -
        parseInt(b.toString().split('-')[1])
      );
    }
    return (
      parseInt(a.toString().split('-')[2]) -
      parseInt(b.toString().split('-')[2])
    );
  }

  mapToEndDate(list: Trip[]): Date[] {
    return list
      .map((trip: Trip) => {
        return trip.endDate;
      })
      .sort((a, b) => {
        return this.parseFuncion(b, a);
      });
  }

  findEndDate(): void {
    this.tmpListOfTrips = this.Trips;
    this.endDate = this.mapToEndDate(this.tmpListOfTrips)[0];
    this.tripsFilter.setDate('max', this.endDate);
  }
  findStartDate(): void {
    this.tmpListOfTrips = this.Trips;
    this.startDate = this.mapToStartDate(this.tmpListOfTrips)[0];
    this.tripsFilter.setDate('min', this.startDate);
  }

  isBiggestOrLowest(val: number): number {
    switch (val) {
      case this.tripsFilter.currMaxVal:
        return 2;
      case this.tripsFilter.currMinVal:
        return 1;
      default:
        return 0;
    }
  }

  updateMaxValues(): void {
    this.tripsFilter.findMaxVal();
    this.tripsFilter.findMinVal();
    this.tripsFilter.getMaxVal().subscribe((maxVal) => (this.maxVal = maxVal));
    this.tripsFilter.getMinVal().subscribe((minVal) => (this.minVal = minVal));
    this.tripsFilter.setPrice('max', this.maxVal);
    this.tripsFilter.setPrice('min', this.minVal);
  }

  getOutput(data: number, index: number): void {
    this.BookedPlaces[index] = data;
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.updateMaxValues();
  }

  getNewTrip(trip: Trip): void {
    this.BookedPlaces.push(0);
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.Trips.push(trip);
    this.tripsFilter.setTrips(this.Trips);
    this.tripsFilter.findMaxVal();
    this.tripsFilter.findMinVal();
    this.tripsFilter.getMaxVal().subscribe((maxVal) => (this.maxVal = maxVal));
    this.tripsFilter.getMinVal().subscribe((minVal) => (this.minVal = minVal));
    this.tripsFilter.addLocation(trip);
    this.tripsFilter.setPrice('max', this.maxVal);
    this.tripsFilter.setPrice('min', this.minVal);
    this.findEndDate();
    this.findStartDate();
    this.rating.addNewTrip();
    this.dbTrips.createTripInDB(trip);
    this.startPorgram();
  }

  addNewTripToTripsFromDB(trip: Trip) {
    if (this.Trips.indexOf(trip) != -1) {
      return;
    }
    this.BookedPlaces.push(0);
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.Trips.push(trip);
    this.tripsFilter.setTrips(this.Trips);
    this.tripsFilter.findMaxVal();
    this.tripsFilter.findMinVal();
    this.tripsFilter.getMaxVal().subscribe((maxVal) => (this.maxVal = maxVal));
    this.tripsFilter.getMinVal().subscribe((minVal) => (this.minVal = minVal));
    this.tripsFilter.addLocation(trip);
    this.tripsFilter.setPrice('max', this.maxVal);
    this.tripsFilter.setPrice('min', this.minVal);
    this.findEndDate();
    this.findStartDate();
    this.rating.addNewTrip();
  }

  deleteTrip(tripToRemove: Trip, index: number): void {
    this.basket.deleteTrip(tripToRemove, true);
    this.rating.removeTrip(index);
    // this.reservedTrips.removeTrip(
    //   this.BookedPlaces[
    //     this.Trips.indexOf(
    //       this.Trips.filter((tripp) => {
    //         return tripp.key == this.tripsFilter.TripsToDisplay[index].key;
    //       })[0]
    //     )
    //   ]
    // );
    this.BookedPlaces.splice(
      this.Trips.indexOf(
        this.Trips.filter((tripp) => {
          return tripp.key == this.tripsFilter.TripsToDisplay[index].key;
        })[0]
      ),
      1
    );
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.tripsFilter.removeLocationFromEverywhere(index);
    this.updateMaxValues();
    this.findEndDate();
    this.findStartDate();
    this.dbTrips.deleteTripFromDB(tripToRemove.key ? tripToRemove.key : '');
  }

  deleteTripFromStart(tripToRemove: Trip, index: number): void {
    this.basket.deleteTrip(tripToRemove, true);
    this.rating.removeTrip(index);
    // this.reservedTrips.removeTrip(
    //   this.BookedPlaces[
    //     this.Trips.indexOf(this.tripsFilter.TripsToDisplay[index])
    //   ]
    // );
    this.BookedPlaces.splice(
      this.Trips.indexOf(this.tripsFilter.TripsToDisplay[index]),
      1
    );
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.tripsFilter.removeLocationFromEverywhere(index);
    this.updateMaxValues();
    this.findEndDate();
    this.findStartDate();
  }

  editTrip(trip: Trip, oldTrip: Trip) {
    this.basket.deleteTrip(oldTrip, true);
    // this.reservedTrips.removeTrip(this.BookedPlaces[this.Trips.indexOf(trip)]);
    this.BookedPlaces[this.Trips.indexOf(trip)] = 0;
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.dbTrips.updateTripInDB(trip.key ? trip.key : '', trip);
    this.startPorgram();
  }

  removeBookedPlacesIndex(index: number): void {
    this.tmpList = [];
    for (let i = 0; i < index; i++) {
      this.tmpList.push(this.BookedPlaces[i]);
    }
    for (let i = index + 1; i < this.BookedPlaces.length; i++) {
      this.tmpList.push(this.BookedPlaces[i]);
    }
    this.BookedPlaces = this.tmpList;
  }

  removeReservations(tripToRemove: Trip): void {
    listOfTrips.filter((trip: Trip) => {
      return trip == tripToRemove;
    });
  }

  buyTrip(
    amount: number,
    tripName: string,
    price: number,
    imgLink: string
  ): void {
    let choosenTrip: Trip = this.Trips.filter((trip) => {
      return (
        trip.name == tripName &&
        trip.unitPrice == price &&
        trip.imgLink == imgLink
      );
    })[0];
    choosenTrip.maxPlaces -= amount;
    this.BookedPlaces[this.Trips.indexOf(choosenTrip)] -= amount;
    this.tripsFilter.setBookedPlaces(this.BookedPlaces);
    this.basket.buyTrip(choosenTrip);
    this.reservedTrips.removeTrip(amount);
    this.boughTripsService.newTripBought(
      new BoughtTrip(
        choosenTrip.name,
        choosenTrip.destination,
        choosenTrip.startDate,
        choosenTrip.endDate,
        choosenTrip.unitPrice,
        choosenTrip.imgLink,
        new Date().toDateString(),
        amount
      )
    );
    this.dbTrips.updateTripInDB(choosenTrip.key!, choosenTrip);
  }

  private loadTripsFromDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dbTrips
        .getTripsFromDB()
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
        .subscribe((data) => {
          this.tripsFromDB = data;
          this.Trips = this.tripsFromDB;
          return resolve(true);
        });
    });
  }

  private async startPorgram() {
    let resp: boolean = await this.loadTripsFromDB();
    if (resp) {
      let len: number = this.BookedPlaces.length;
      for (let i = 0; i < this.Trips.length - len; i++) {
        this.BookedPlaces.push(0);
      }
      this.tripsFilter.setBookedPlaces(this.BookedPlaces);
      this.tripsFilter.setLocations(this.Trips);
      this.tripsFilter
        .getMaxVal()
        .subscribe((maxVal) => (this.maxVal = maxVal));
      this.tripsFilter
        .getMinVal()
        .subscribe((minVal) => (this.minVal = minVal));
      this.findEndDate();
      this.findStartDate();
      this.tripsFilter
        .getChosenLocations()
        .subscribe(
          (ChoosenLocations) => (this.ChoosenLocations = ChoosenLocations)
        );
      this.tripsFilter.setTrips(this.Trips);
      this.updateMaxValues();
      this.tripsFilter.setCurrPrice('max', this.maxVal);
      this.tripsFilter.setCurrPrice('min', this.minVal);
      this.rating.createListOfRating(this.Trips.length);
      this.tripsFilter.setTripsToDisplay(this.Trips);
      this.boughTripsService.getBoughtTrips();
    }
  }

  private addTripsFromFileToDB() {
    for (let trip of listOfTrips) {
      this.dbTrips.createTripInDB(trip);
    }
  }

  ngOnInit(): void {
    // this.addTripsFromFileToDB()
    this.numberOfUsage += 1;
    // this.dbTrips.deleteAllTripsFromDB();
    this.startPorgram();
  }
}
