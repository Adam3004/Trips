import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css'],
})
export class EditTripComponent implements OnInit {
  key!: string;
  trip!: Trip;
  oldTrip!: Trip;
  datesGood: number = 0;
  submitted = false;
  constructor(
    private route: ActivatedRoute,
    private tripsService: ListOfTripsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getKey();
    this.findTrip();
  }

  getKey(): void {
    this.route.params.subscribe((params) => {
      this.key = params['key'];
    });
  }

  findTrip(): void {
    if (this.tripsService.Trips.length == 0) {
      this.tripsService.ngOnInit();
      setTimeout(() => {
        this.oldTrip = this.tripsService.Trips.filter((trip) => {
          return trip.key == this.key;
        })[0];
        this.trip = this.oldTrip;
        this.oldTrip = Object.assign([], this.trip);
      }, 400);
    } else {
      this.oldTrip = this.tripsService.Trips.filter((trip) => {
        return trip.key == this.key;
      })[0];
      this.trip = this.oldTrip;
      this.oldTrip = Object.assign([], this.trip);
    }
  }

  onSubmit(): void {
    if (
      this.compareDates(
        this.trip.startDate.toString(),
        new Date().toJSON().split('T')[0]
      )
    ) {
      this.datesGood = 3;
    } else if (this.trip.endDate >= this.trip.startDate) {
      this.submitted = true;
      this.datesGood = 1;
      this.tripsService.editTrip(this.trip, this.oldTrip);
      this.router.navigateByUrl('/trips');
    } else {
      this.datesGood = 2;
    }
  }

  compareDates(trying: string, curr: string): boolean {
    if (parseInt(trying.split('-')[0]) - parseInt(curr.split('-')[0]) < 0) {
      return true;
    } else if (
      parseInt(trying.split('-')[0]) - parseInt(curr.split('-')[0]) ==
      0
    ) {
      if (parseInt(trying.split('-')[1]) - parseInt(curr.split('-')[1]) < 0) {
        return true;
      } else if (
        parseInt(trying.split('-')[1]) - parseInt(curr.split('-')[1]) ==
        0
      ) {
        if (
          parseInt(trying.split('-')[2]) - parseInt(curr.split('-')[2]) <=
          0
        ) {
          return true;
        }
        return false;
      }
    }
    return false;
  }
}
