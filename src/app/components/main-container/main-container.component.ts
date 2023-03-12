import { Component, OnInit } from '@angular/core';
import { Trip } from '../../models/trip';
import { FilterTripsComponent } from '../filter-trips/filter-trips.component';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
})
export class MainContainerComponent implements OnInit {
  timeOfUsage: number = 0;
  constructor(public Trips: ListOfTripsService, private router: Router) {}

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

  // deleteTrip(tripToRemove: Trip, index: number): void {
  //   this.Trips.deleteTrip(tripToRemove, index);
  // }


  ngOnInit(): void {
    this.timeOfUsage++;
    if (this.timeOfUsage == 1) {
      this.Trips.ngOnInit();
    }
  }
}
