import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { BiggestSmallestPriceService } from './biggestSmallestPriceService.service';
import { RatingServiceService } from './rating-service.service';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class FilterTripsService {
  minPrice: number = 0;
  maxPrice: number = 1;
  minRate: number = 0;
  maxRate: number = 5;
  maxVal: number = 0;
  minVal: number = 0;
  fromDate?: Date;
  toDate?: Date;
  Locations: string[] = [];
  LocationsSet: Set<string> = new Set();
  currMaxPrice?: number;
  currMinPrice?: number;
  currMaxVal?: number;
  currMinVal?: number;
  IsLocationChosen: boolean[] = [];
  ChosenLocations: string[] = [];
  Trips: Trip[] = [];
  TripsToDisplay: Trip[] = [];
  BookedPlaces: number[] = [];
  constructor(private price: BiggestSmallestPriceService) {}

  setMaxPrice(): Observable<number> {
    const maxPrice = of(this.maxPrice);
    return maxPrice;
  }
  setMinPrice(): Observable<number> {
    const minPrice = of(this.minPrice);
    return minPrice;
  }

  setTrips(newTrips: Trip[]): void {
    this.Trips = newTrips;
  }

  setTripsToDisplay(newList: Trip[]): void {
    this.TripsToDisplay = newList;
  }

  setBookedPlaces(newList: number[]): void {
    this.BookedPlaces = newList;
  }

  setToDate(): Observable<any> {
    const toDate = of(this.toDate);
    return toDate;
  }

  setFromDate(): Observable<any> {
    const fromDate = of(this.fromDate);
    return fromDate;
  }

  getMaxVal(): Observable<number> {
    const maxVal = of(this.maxVal);
    return maxVal;
  }

  getMinVal(): Observable<number> {
    const minVal = of(this.minVal);
    return minVal;
  }

  getMinRating(): Observable<number> {
    const minRating = of(this.minRate);
    return minRating;
  }

  getMaxRating(): Observable<number> {
    const maxRating = of(this.maxRate);
    return maxRating;
  }

  getIsLocationChosen(): Observable<boolean[]> {
    const IsLocationChosen = of(this.IsLocationChosen);
    return IsLocationChosen;
  }
  getLocations(): Observable<string[]> {
    const Locations = of(this.Locations);
    return Locations;
  }
  getChosenLocations(): Observable<string[]> {
    const ChosenLocations = of(this.ChosenLocations);
    return ChosenLocations;
  }

  setCurrPrice(option: string, value: number): void {
    if (option == 'max') {
      if (value < this.maxVal) {
        this.currMaxPrice = value;
      } else {
        this.currMaxPrice = this.maxVal;
      }
    }
    if (option == 'min') {
      if (value > this.minPrice) {
        this.currMinPrice = value;
      } else {
        this.currMinPrice = this.minVal;
      }
    }
  }

  setPrice(option: string, value: number): void {
    if (option == 'max') {
      this.maxPrice = value;
    }
    if (option == 'min') {
      this.minPrice = value;
    }
  }

  setDate(option: string, value: Date): void {
    if (option == 'max') {
      this.toDate = value;
    }
    if (option == 'min') {
      this.fromDate = value;
    }
  }

  addLocation(trip: Trip): void {
    if (!this.LocationsSet.has(trip.destination.toUpperCase())) {
      this.LocationsSet.add(trip.destination.toUpperCase());
      this.Locations.push(trip.destination.toUpperCase());
      this.IsLocationChosen.push(true);
      this.ChosenLocations.push(this.Locations[this.Locations.length - 1]);
      this.checkRequirementsForTrip(trip);
    } else {
      this.checkRequirementsForTrip(trip);
    }
  }

  checkRequirementsForTrip(trip: Trip): void {
    if (this.ChosenLocations && this.ChosenLocations.length > 0) {
      if (
        this.currMaxPrice &&
        this.currMinPrice &&
        this.currMinPrice <= trip.unitPrice &&
        this.currMaxPrice >= trip.unitPrice &&
        this.fromDate &&
        this.compareDates(this.fromDate, trip.startDate) &&
        this.toDate &&
        this.compareDates(trip.endDate, this.toDate)
      ) {
        this.TripsToDisplay.push(trip);
        this.findMaxVal();
        this.findMinVal();
      }
    }
  }

  compareDates(trying: Date, curr: Date): boolean {
    if (
      parseInt(trying.toString().split('-')[0]) -
        parseInt(curr.toString().split('-')[0]) <
      0
    ) {
      return true;
    } else if (
      parseInt(trying.toString().split('-')[0]) -
        parseInt(curr.toString().split('-')[0]) ==
      0
    ) {
      if (
        parseInt(trying.toString().split('-')[1]) -
          parseInt(curr.toString().split('-')[1]) <
        0
      ) {
        return true;
      } else if (
        parseInt(trying.toString().split('-')[1]) -
          parseInt(curr.toString().split('-')[1]) ==
        0
      ) {
        if (
          parseInt(trying.toString().split('-')[2]) -
            parseInt(curr.toString().split('-')[2]) <=
          0
        ) {
          return true;
        }
        return false;
      }
    }
    return false;
  }

  removeLocationFromEverywhere(index: number): void {
    let tmpVal2: string = this.TripsToDisplay[index].destination.toUpperCase();
    let tmpList: Trip[] = this.TripsToDisplay.filter((trip: Trip) => {
      return trip.destination.toUpperCase() == tmpVal2;
    });
    if (tmpList.length == 1) {
      if (
        this.ChosenLocations.indexOf(
          this.TripsToDisplay[index].destination.toUpperCase()
        ) != -1
      ) {
        this.ChosenLocations.splice(
          this.ChosenLocations.indexOf(
            this.TripsToDisplay[index].destination.toUpperCase()
          ),
          1
        );
      }
      this.IsLocationChosen.splice(
        this.Locations.indexOf(
          this.TripsToDisplay[index].destination.toUpperCase()
        ),
        1
      );
      this.Locations.splice(
        this.Locations.indexOf(
          this.TripsToDisplay[index].destination.toUpperCase()
        ),
        1
      );
      this.Trips.splice(this.Trips.indexOf(this.TripsToDisplay[index]), 1);
      this.LocationsSet.delete(tmpVal2);
      this.TripsToDisplay.splice(index, 1);
    } else {
      if (
        this.ChosenLocations.indexOf(
          this.TripsToDisplay[index].destination.toUpperCase()
        ) != -1 &&
        this.ChosenLocations[index] ==
          this.TripsToDisplay[index].destination.toUpperCase()
      ) {
        this.ChosenLocations.splice(
          this.ChosenLocations.indexOf(
            this.TripsToDisplay[index].destination.toUpperCase()
          ),
          1
        );

        this.IsLocationChosen.splice(
          this.Locations.indexOf(
            this.TripsToDisplay[index].destination.toUpperCase()
          ),
          1
        );
        this.Locations.splice(
          this.Locations.indexOf(
            this.TripsToDisplay[index].destination.toUpperCase()
          ),
          1
        );
        this.LocationsSet.delete(tmpVal2);
        this.Trips.splice(this.Trips.indexOf(this.TripsToDisplay[index]), 1);
        this.TripsToDisplay.splice(index, 1);
        let trip = this.TripsToDisplay[this.TripsToDisplay.indexOf(tmpList[1])];
        this.LocationsSet.add(trip.destination.toUpperCase());
        this.Locations.push(trip.destination.toUpperCase());
        this.IsLocationChosen.push(true);
        this.ChosenLocations.push(this.Locations[this.Locations.length - 1]);
      } else {
        this.Trips.splice(this.Trips.indexOf(this.TripsToDisplay[index]), 1);
        this.TripsToDisplay.splice(index, 1);
      }
    }
  }

  setLocations(Trips: Trip[]): void {
    this.Locations = [];
    this.LocationsSet = new Set();
    this.IsLocationChosen = [];
    this.ChosenLocations = [];
    for (let trip of Trips) {
      this.LocationsSet.add(trip.destination.toUpperCase());
    }
    for (let destination of this.LocationsSet) {
      this.Locations.push(destination);
    }
    for (let index = 0; index < this.Locations.length; index++) {
      this.IsLocationChosen.push(true);
      this.ChosenLocations.push(this.Locations[index]);
    }
  }

  changeIfChecked(index: number): void {
    this.IsLocationChosen[index] = !this.IsLocationChosen[index];
    this.addOrRemoveLocation(index);
  }

  addOrRemoveLocation(index: number): void {
    if (
      this.IsLocationChosen[index] &&
      !(this.Locations[index] in this.ChosenLocations)
    ) {
      this.ChosenLocations.push(this.Locations[index]);
    } else if (
      !this.IsLocationChosen[index] &&
      this.ChosenLocations.indexOf(this.Locations[index]) != -1
    ) {
      this.removeLocation(this.Locations[index]);
    }
  }
  removeLocation(location: string): void {
    this.ChosenLocations = this.ChosenLocations.filter((currLocation) => {
      return currLocation != location;
    });
  }

  findMaxVal(): void {
    let tmpListOfTrips: Trip[];
    tmpListOfTrips = this.Trips;
    this.maxVal = this.findExactMaxVal(tmpListOfTrips);
    this.findCurrMaxVal();
    if (this.currMaxVal) {
      this.price.setPrice('biggest', this.currMaxVal);
    }
  }

  findExactMaxVal(list: Trip[]): number {
    list = this.filterTrips(list);
    return Math.max(...this.mapToUnitPrice(list));
  }

  findCurrMaxVal(): void {
    let tmpListOfTrips: Trip[];
    if (this.TripsToDisplay.length > 0) {
      tmpListOfTrips = this.TripsToDisplay;
    } else {
      tmpListOfTrips = this.Trips;
    }
    this.currMaxVal = this.findExactMaxVal(tmpListOfTrips);
  }

  findMinVal(): void {
    let tmpListOfTrips: Trip[];
    tmpListOfTrips = this.Trips;
    this.minVal = this.findExactMinVal(tmpListOfTrips);
    this.price.setPrice('smallest', this.minVal);
    this.findCurrMinVal();
    if (this.currMinVal) {
      this.price.setPrice('smallest', this.currMinVal);
    }
  }

  findExactMinVal(list: Trip[]): number {
    list = this.filterTrips(list);
    return Math.min(...this.mapToUnitPrice(list));
  }

  findCurrMinVal(): void {
    let tmpListOfTrips: Trip[];
    if (this.TripsToDisplay.length > 0) {
      tmpListOfTrips = this.TripsToDisplay;
    } else {
      tmpListOfTrips = this.Trips;
    }
    this.currMinVal = this.findExactMinVal(tmpListOfTrips);
  }

  mapToUnitPrice(list: Trip[]): number[] {
    return list.map((trip: Trip) => {
      return trip.unitPrice;
    });
  }

  filterTrips(list: Trip[]): Trip[] {
    let tmpListOfTrips: Trip[] = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].maxPlaces - this.BookedPlaces[i] > 0) {
        tmpListOfTrips.push(list[i]);
      }
    }
    return tmpListOfTrips;
  }

  setRating(newMaxRate: number, newMinRate: number): void {
    this.maxRate = Math.ceil(newMaxRate);
    this.minRate = Math.floor(newMinRate);
  }
}
