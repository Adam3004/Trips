import { Component } from '@angular/core';
import { Trip } from 'src/app/models/trip';
import { ListOfTripsService } from 'src/app/services/list-of-trips.service';

@Component({
  selector: 'app-trips-manager',
  templateUrl: './trips-manager.component.html',
  styleUrls: ['./trips-manager.component.css']
})
export class TripsManagerComponent {
  constructor(public Trips: ListOfTripsService) {}

  isBiggestOrLowest(val: number): number {
    switch (val) {
      case this.Trips.tripsFilter.currMaxVal:
        return 2;
      case this.Trips.tripsFilter.currMinVal:
        return 1;
      default:
        return 0;
    }
  }

  getOutput(data: number, index: number): void {
    this.Trips.getOutput(data, index);
  }

  deleteTrip(tripToRemove: Trip, index: number): void {
    this.Trips.deleteTrip(tripToRemove, index);
  }
}
