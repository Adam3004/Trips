import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BoughtTrip } from '../models/boughtTrip';
import { DbBasketService } from './db-services/db-boughtTrips.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BoughtTripsService {
  list: BoughtTrip[] = [];
  tripsFromDB: any;
  constructor(
    private DBboughtTripsService: DbBasketService,
    private userService: UserService
  ) {}

  getBoughtTrips() {
    let sessionUser = this.userService.getSessionUser();
    if (sessionUser) {
      this.list = this.userService.getSessionUser()!.boughtTrips
        ? this.userService.getSessionUser()!.boughtTrips
        : [];
    }
    // this.DBboughtTripsService.getTripsFromDB()
    //   .snapshotChanges()
    //   .pipe(
    //     map((changes) =>
    //       changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.tripsFromDB = data;
    //     this.list = this.tripsFromDB;
    //   });
  }

  newTripBought(newTrip: BoughtTrip): void {
    this.list.push(newTrip);
    console.log(newTrip)
    // this.DBboughtTripsService.createTripInDB(newTrip);
    this.userService.userBoughtTrip(newTrip);
  }

  isSomeTripCommingSoon(): boolean {
    var time: number;
    for (let trip of this.list) {
      time = this.changeMilisecondsToDays(
        new Date(trip.startDate).getTime() - new Date().getTime()
      );
      if (time <= 14 && time > 0) {
        return true;
      }
    }
    return false;
  }

  changeMilisecondsToDays(time: number): number {
    return time / (1000 * 60 * 60 * 24);
  }


  findBought(tripName: string): BoughtTrip | null {
    const result = this.list.filter((trip) => {
      return trip.name == tripName;
    });
    if (result.length > 0) {
      return result[0];
    }
    return null;
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

  compareDates(trying: string, curr: string): boolean {
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

  checkWasGuestOnTrip(tripName:string) {
    const boughtTrip: BoughtTrip | null = this.findBought(
      tripName!
    );
    if (boughtTrip == null) {
      return false;
    }
    if (this.checkStatus(boughtTrip) == 'ended') {
      return true;
    }
    return false;
  }

  checkStatus(trip: BoughtTrip): string {
    const now: string = this.formatDate(new Date());
    if (this.compareDates(now, trip.startDate.toString())) {
      return 'waiting';
    } else {
      if (this.compareDates(now, trip.endDate.toString())) {
        return 'active';
      } else {
        return 'ended';
      }
    }
  }

}
