import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Trip } from '../../models/trip';
import { ChangeCurrencyPipe } from '../../pipes/change-currency.pipe';
import { BiggestSmallestPriceService } from '../../services/biggestSmallestPriceService.service';
import { ReservedTripsServiceService } from '../../services/reserved-trips-service.service';
import { RatingServiceService } from '../../services/rating-service.service';
import { BasketService } from '../../services/basket.service';
import { CurrencyService } from '../../services/currency.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-window',
  templateUrl: './trip-window.component.html',
  styleUrls: ['./trip-window.component.css'],
})
export class TripWindowComponent implements OnInit {
  @Input() trip?: Trip;
  @Input() biggestOrLowest?: number;
  @Input() index?: number;
  @Output() bookedPlaces: EventEmitter<number> = new EventEmitter<number>();
  currAvailablePlaces?: number;
  biggestPrice?: number;
  smallestPrice?: number;
  averageRating: number = 0;
  opinionsNumber: number = 0;
  sumOfRates: number = 0;

  constructor(
    public prices: BiggestSmallestPriceService,
    public reservedTrips: ReservedTripsServiceService,
    private rating: RatingServiceService,
    private basket: BasketService,
    public currencyService: CurrencyService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.findNumberOfAvailablePlaces();
      if (this.index || this.index == 0) {
        this.averageRating = this.rating.getAvg(this.index);
        this.sumOfRates = this.rating.getSum(this.index);
        this.opinionsNumber = this.rating.getNumberOfOpinions(this.index);
      }
    }, 600);
  }

  findNumberOfAvailablePlaces(): void {
    if (this.trip) {
      this.currAvailablePlaces =
        this.trip?.maxPlaces - this.basket.getResevedPlaces(this.trip);
    }
  }

  changeCurrency(newCurrency: string): void {
    this.currencyService.changeCurrency(newCurrency);
  }

  changeAvailablePlaces(increase: boolean): void {
    if (
      increase &&
      (this.currAvailablePlaces || this.currAvailablePlaces == 0) &&
      this.trip &&
      this.currAvailablePlaces < this.trip.maxPlaces
    ) {
      this.currAvailablePlaces += 1;
      // this.reservedTrips.removeTrip(1);
      this.basket.removeReservation(this.trip);
    } else if (
      !increase &&
      this.currAvailablePlaces &&
      this.trip &&
      this.currAvailablePlaces > 0
    ) {
      this.currAvailablePlaces -= 1;
      // this.reservedTrips.addTrip(1);
      this.basket.addReservation(this.trip, 1, true);
    }
    if (
      this.trip &&
      (this.currAvailablePlaces || this.currAvailablePlaces == 0)
    ) {
      this.bookedPlaces.emit(this.trip.maxPlaces - this.currAvailablePlaces);
    }
  }

  // changeRating(rate: number): void {
  //   this.sumOfRates += rate;
  //   this.opinionsNumber += 1;
  //   this.averageRating = +(this.sumOfRates / this.opinionsNumber).toFixed(2);
  //   if (this.index || this.index == 0) {
  //     this.rating.changeRating(this.index, this.averageRating, rate);
  //   }
  // }

  changeCommunicate(): string {
    if (this.currAvailablePlaces && this.currAvailablePlaces > 3) {
      return 'Book your place now!';
    } else if (this.currAvailablePlaces && this.currAvailablePlaces > 0) {
      return 'Last vacancies!';
    } else {
      return 'This trip is sold out';
    }
  }

  navigateToDetailedView(id: number) {
    if (this.userService.getSessionUser() != null) {
      this.router.navigate(['/trips', id]);
    }
  }

  canReserveTrip(): boolean {
    if (this.userService.isCustomer()) {
      return true;
    }
    return false;
  }
  // [routerLink]="['/trips', index]"
}
