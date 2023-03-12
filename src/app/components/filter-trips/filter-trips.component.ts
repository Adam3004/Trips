import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { FilterTripsService } from '../../services/filter-trips.service';
import { RatingServiceService } from '../../services/rating-service.service';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-filter-trips',
  templateUrl: './filter-trips.component.html',
  styleUrls: ['./filter-trips.component.css'],
})
export class FilterTripsComponent implements OnInit {
  minRate?: number;
  maxRate?: number;
  currMinPrice: number = 0;
  currMaxPrice: number = 0;
  fromDate?: Date;
  toDate?: Date;
  Locations: string[] = [];
  IsLocationChosen: boolean[] = [];
  ChosenLocations: string[] = [];
  TripsToDisplay?: Trip[];

  constructor(
    public filterTrips: FilterTripsService,
    private rating: RatingServiceService,
    public currencyService: CurrencyService
  ) {}

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
      if (this.ChosenLocations.indexOf(this.Locations[index]) != -1) {
        this.ChosenLocations.splice(
          this.ChosenLocations.indexOf(this.Locations[index]),
          1
        );
      }
    }
  }

  changeCurrValue(option: string): void {
    if (this.currMaxPrice && option == 'max') {
      this.filterTrips.setCurrPrice('max', this.currMaxPrice);
    } else if (this.currMinPrice && option == 'min') {
      this.filterTrips.setCurrPrice('min', this.currMinPrice);
    }
  }

  ngOnInit(): void {
    if (this.filterTrips.Locations) {
      this.Locations = this.filterTrips.Locations;
    }
    setTimeout(() => {
      this.currMinPrice = this.filterTrips.minPrice;
      this.currMaxPrice = this.filterTrips.maxPrice;

      this.filterTrips
        .getIsLocationChosen()
        .subscribe(
          (IsLocationChosen) => (this.IsLocationChosen = IsLocationChosen)
        );
      this.filterTrips
        .getChosenLocations()
        .subscribe(
          (ChosenLocations) => (this.ChosenLocations = ChosenLocations)
        );

      this.filterTrips
        .getLocations()
        .subscribe((Locations) => (this.Locations = Locations));

      this.checkRequirements();
      this.filterTrips
        .setFromDate()
        .subscribe((fromDate) => (this.fromDate = fromDate));
      this.filterTrips
        .setToDate()
        .subscribe((toDate) => (this.toDate = toDate));

      this.filterTrips
        .getMinRating()
        .subscribe((minRating) => (this.minRate = minRating));

      this.filterTrips
        .getMaxRating()
        .subscribe((maxRating) => (this.maxRate = maxRating));
    }, 550);
  }

  checkRequirements(): void {
    this.TripsToDisplay = [];
    if (this.ChosenLocations && this.ChosenLocations.length > 0) {
      for (let trip of this.filterTrips.Trips) {
        if (
          this.ChosenLocations.indexOf(trip.destination.toUpperCase()) == -1
        ) {
          continue;
        }
        if (
          this.filterTrips.currMaxPrice &&
          this.filterTrips.currMinPrice &&
          (this.filterTrips.currMinPrice > trip.unitPrice ||
            this.filterTrips.currMaxPrice < trip.unitPrice)
        ) {
          continue;
        }
        if (
          this.fromDate &&
          !this.filterTrips.compareDates(this.fromDate, trip.startDate)
        ) {
          continue;
        }
        if (
          this.toDate &&
          !this.filterTrips.compareDates(trip.endDate, this.toDate)
        ) {
          continue;
        }
        if (
          this.rating.getRating(trip) < this.filterTrips.minRate ||
          this.rating.getRating(trip) > this.filterTrips.maxRate
        ) {
          continue;
        }
        this.TripsToDisplay.push(trip);
      }
    }
    this.filterTrips.setTripsToDisplay(this.TripsToDisplay);
    this.filterTrips.findMaxVal();
    this.filterTrips.findMinVal();
  }

  findFromDateValue(): Date | undefined {
    if (this.fromDate) {
      this.filterTrips.setDate('min', this.fromDate);
    }
    if (
      this.fromDate &&
      this.filterTrips.fromDate &&
      this.filterTrips.compareDates(this.fromDate, this.filterTrips.fromDate)
    ) {
      return this.fromDate;
    } else {
      return this.filterTrips.fromDate;
    }
  }
  findToDateValue(): Date | undefined {
    if (this.toDate) {
      this.filterTrips.setDate('max', this.toDate);
    }
    if (
      this.toDate &&
      this.filterTrips.toDate &&
      this.toDate < this.filterTrips.toDate
    ) {
      return this.toDate;
    } else {
      return this.filterTrips.toDate;
    }
  }

  changeDate(): void {
    if (this.fromDate) {
      this.filterTrips.setDate('min', this.fromDate);
    }
    if (this.toDate) {
      this.filterTrips.setDate('max', this.toDate);
    }
    this.checkRequirements();
    this.filterTrips.setCurrPrice('max', this.currMaxPrice);
    this.filterTrips.setCurrPrice('min', this.currMinPrice);
  }

  setRating(): void {
    if (
      (this.maxRate || this.maxRate == 0) &&
      (this.minRate || this.minRate == 0)
    ) {
      this.filterTrips.setRating(this.maxRate, this.minRate);
    }
    this.checkRequirements();
  }
}
