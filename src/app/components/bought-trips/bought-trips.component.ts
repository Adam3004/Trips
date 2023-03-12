import { Component, OnInit } from '@angular/core';
import { BoughtTripsService } from '../../services/bought-trips.service';
import { BoughtTrip } from '../../models/boughtTrip';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-bought-trips',
  templateUrl: './bought-trips.component.html',
  styleUrls: ['./bought-trips.component.css'],
})
export class BoughtTripsComponent implements OnInit {
  Filters: boolean[] = [true, true, true];
  filterWindowVisible = false;

  constructor(
    public boughtTripsService: BoughtTripsService,
    public currencyService: CurrencyService
  ) {}
  ngOnInit(): void {
    if (this.boughtTripsService.list.length == 0) {
      this.boughtTripsService.getBoughtTrips();
    }
  }

  showValue(): string {
    let val = this.currencyService.currency;
    if (val == 'dolar') {
      return 'dolars';
    }
    return val;
  }

  checkStatus(trip: BoughtTrip): string {
    const now: string = this.boughtTripsService.formatDate(new Date());
    if (this.boughtTripsService.compareDates(now, trip.startDate.toString())) {
      return 'waiting';
    } else {
      if (this.boughtTripsService.compareDates(now, trip.endDate.toString())) {
        return 'active';
      } else {
        return 'ended';
      }
    }
  }

  checkVisibility(trip: BoughtTrip): boolean {
    const option: string = this.checkStatus(trip);
    switch (option) {
      case 'waiting':
        return this.Filters[0];
      case 'active':
        return this.Filters[1];
      default:
        return this.Filters[2];
    }
  }

  getFilteredTrips() {
    return this.boughtTripsService.list.filter((trip) => {
      return this.checkVisibility(trip);
    });
  }

  changeFilterWindowVisibility(): void {
    this.filterWindowVisible = !this.filterWindowVisible;
  }
}
