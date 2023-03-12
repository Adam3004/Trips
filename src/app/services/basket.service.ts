import { Injectable } from '@angular/core';
import { deepEqual } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { BasketElement } from '../models/basketElement';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { ListOfTripsService } from './list-of-trips.service';
import { ReservedTripsServiceService } from './reserved-trips-service.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  ReservedTrips: BasketElement[] = [];
  ActiveTrips: Trip[] = [];
  sumOfPrices: number = 0;
  numberOfReservations: number = 0;
  constructor(
    private userService: UserService,
    private reservationService: ReservedTripsServiceService
  ) {}

  initializeBasket(sessionUser: User, listOfTrips: Trip[]) {
    if (sessionUser) {
      for (let basketElement of sessionUser.basket) {
        const result = listOfTrips.filter((trip) => {
          return trip.key == basketElement.key;
        });
        // console.log(result[0].maxPlaces);
        if (result) {
          this.addReservation(
            result[0],
            Math.min(basketElement.amount, result[0].maxPlaces),
            false
          );
        }
      }
      // console.log(this.getResevedPlaces(this.ActiveTrips[0]));
    }
  }

  comparer(trip: Trip): number {
    let tmpList = this.ActiveTrips.filter((activeTrip) => {
      return trip.key == activeTrip.key;
    });

    if (tmpList.length > 0) {
      return this.ActiveTrips.indexOf(tmpList[0]);
    }
    return -1;
  }

  getResevedPlaces(trip: Trip): number {
    let index = this.comparer(trip);
    if (index != -1) {
      return this.ReservedTrips[index].amount;
    }
    return 0;
  }

  addReservation(
    trip: Trip,
    numberOfReservations: number,
    pushToDB: boolean
  ): void {
    if (this.getResevedPlaces(trip) > numberOfReservations) {
      window.location.reload();
      return;
    }
    this.sumOfPrices += trip.unitPrice * numberOfReservations;
    this.numberOfReservations += numberOfReservations;
    if (this.comparer(trip) == -1) {
      this.ActiveTrips.push(trip);
      this.ReservedTrips.push(
        new BasketElement(
          trip.key!,
          trip.name,
          trip.unitPrice,
          numberOfReservations,
          trip.imgLink
        )
      );
    } else {
      this.ReservedTrips[this.comparer(trip)].amount += numberOfReservations;
    }
    this.reservationService.addTrip(numberOfReservations);
    if (pushToDB) {
      this.userService.userReservationChange(this.ReservedTrips);
    }
  }

  removeReservation(trip: Trip): void {
    if (this.ReservedTrips[this.comparer(trip)].amount == 1) {
      this.deleteTrip(trip, true);
    } else {
      this.numberOfReservations -= 1;
      this.sumOfPrices -= trip.unitPrice;
      this.ReservedTrips[this.comparer(trip)].amount -= 1;
      this.reservationService.removeTrip(1);
      this.userService.userReservationChange(this.ReservedTrips);
    }
  }

  deleteTrip(trip: Trip, pushToDB: boolean): void {
    let index = this.ActiveTrips.indexOf(trip);
    if (index == -1) {
      index = this.comparer(trip);
    }
    if (index != -1) {
      this.numberOfReservations -= this.ReservedTrips[index].amount;
      this.sumOfPrices -= trip.unitPrice * this.ReservedTrips[index].amount;
      this.reservationService.removeTrip(this.ReservedTrips[index].amount);
      this.ActiveTrips.splice(index, 1);
      this.ReservedTrips.splice(index, 1);
    }
    if (pushToDB) {
      this.userService.userReservationChange(this.ReservedTrips);
    }
  }

  buyTrip(trip: Trip): void {
    this.deleteTrip(trip, true);
  }

  clearBasketAfterSignOut() {
    for (let elem of this.ActiveTrips) {
      this.deleteTrip(elem, false);
    }
  }
}
