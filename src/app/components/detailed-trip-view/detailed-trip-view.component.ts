import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { CurrencyService } from '../../services/currency.service';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { OpinionsService } from '../../services/opinions.service';
import { RatingServiceService } from '../../services/rating-service.service';
import { ReservedTripsServiceService } from '../../services/reserved-trips-service.service';
import { Trip } from '../../models/trip';
import { RatingOption } from 'src/app/models/ratingOptions';
import { UserService } from 'src/app/services/user.service';
import { BoughtTripsService } from 'src/app/services/bought-trips.service';

@Component({
  selector: 'app-detailed-trip-view',
  templateUrl: './detailed-trip-view.component.html',
  styleUrls: ['./detailed-trip-view.component.css'],
})
export class DetailedTripViewComponent implements OnInit, OnDestroy {
  id!: number;
  private sub: any;
  currTrip!: Trip;
  active: number = 0;
  averageRating: number = 0;
  opinionsNumber: number = 0;
  sumOfRates: number = 0;
  currAvailablePlaces?: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tripsService: ListOfTripsService,
    public currencyService: CurrencyService,
    private rating: RatingServiceService,
    private basket: BasketService,
    private reservedTrips: ReservedTripsServiceService,
    public opinionsService: OpinionsService,
    private userService: UserService,
    private boughtTripsService: BoughtTripsService
  ) {}

  async ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });
    let tmp = await this.findTrip();
    if (tmp) {
      setTimeout(() => {
        this.averageRating = this.rating.getAvg(this.id);
        this.sumOfRates = this.rating.getSum(this.id);
        this.opinionsNumber = this.rating.getNumberOfOpinions(this.id);
        this.findNumberOfAvailablePlaces();
      }, 700);
    }
  }

  async findTrip(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.tripsService.tripsFilter.TripsToDisplay.length == 0) {
        this.tripsService.ngOnInit();
      }
      setTimeout(() => {
        if (this.tripsService.tripsFilter.TripsToDisplay.length == 0) {
          this.currTrip = this.tripsService.tripsFilter.Trips[this.id];
        } else {
          this.currTrip = this.tripsService.tripsFilter.TripsToDisplay[this.id];
        }
        if (this.currTrip == undefined) {
          this.router.navigate(['**']);
        }
      }, 600);
      return resolve(true);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onButtonClick(val: number) {
    this.active = (this.active + val) % 3;
    if (this.active < 0) {
      this.active = 2;
    }
  }

  showValue(): string {
    let val = this.currencyService.currency;
    if (val == 'dolar') {
      return 'dolars';
    }
    return val;
  }

  backToAllTrips() {
    this.router.navigate(['/trips']);
  }

  changeRating(rate: number): void {
    let sessionUser = this.userService.getSessionUser();
    if (
      sessionUser == null ||
      (this.userService.isManager() &&
        !(this.userService.isAdmin() || this.userService.isCustomer))
    ) {
      window.alert('You do not fulfil requirements to rate this trip');
      return;
    }
    let tmpTrip: Trip;
    if (this.tripsService.tripsFilter.TripsToDisplay.length == 0) {
      tmpTrip = this.tripsService.tripsFilter.TripsToDisplay[this.id];
    } else {
      tmpTrip = this.tripsService.Trips[this.id];
    }
    if (
      !this.userService.isAdmin() &&
      !this.boughtTripsService.checkWasGuestOnTrip(tmpTrip.name)
    ) {
      window.alert('You can rate only trips on which u were');
      return;
    }
    if (
      !this.userService.isAdmin() &&
      this.didUserAddeedOpinion(sessionUser!.id!)
    ) {
      window.alert('You can rate this trip only once');
      return;
    }
    this.sumOfRates += rate;
    this.opinionsNumber += 1;
    this.averageRating = +(this.sumOfRates / this.opinionsNumber).toFixed(2);
    this.rating.changeRating(this.id, this.averageRating, rate, sessionUser.id);
  }

  private didUserAddeedOpinion(key: string) {
    let tmpID;
    if (this.tripsService.tripsFilter.TripsToDisplay.length == 0) {
      tmpID = this.tripsService.Trips.indexOf(
        this.tripsService.tripsFilter.TripsToDisplay[this.id]
      );
    } else {
      tmpID = this.id;
    }

    return (
      this.rating.listOfRating[tmpID].userKeys &&
      this.rating.listOfRating[tmpID].userKeys!.indexOf(key) != -1
    );
  }

  changeAvailablePlaces(increase: boolean): void {
    // console.log('dziala', this.currAvailablePlaces);
    if (!this.currAvailablePlaces) {
      this.findNumberOfAvailablePlaces();
    }
    if (
      increase &&
      (this.currAvailablePlaces || this.currAvailablePlaces == 0) &&
      this.currTrip &&
      this.currAvailablePlaces < this.currTrip.maxPlaces
    ) {
      this.currAvailablePlaces += 1;
      // this.reservedTrips.removeTrip(1);
      this.basket.removeReservation(this.currTrip);
    } else if (
      !increase &&
      this.currAvailablePlaces &&
      this.currTrip &&
      this.currAvailablePlaces > 0
    ) {
      this.currAvailablePlaces -= 1;
      // this.reservedTrips.addTrip(1);
      this.basket.addReservation(this.currTrip, 1, true);
    }
    if (
      this.currTrip &&
      (this.currAvailablePlaces || this.currAvailablePlaces == 0)
    ) {
      this.tripsService.getOutput(
        this.currTrip.maxPlaces - this.currAvailablePlaces,
        this.id
      );
    }
  }

  findNumberOfAvailablePlaces(): void {
    this.currAvailablePlaces =
      this.currTrip?.maxPlaces - this.basket.getResevedPlaces(this.currTrip);
    // console.log(this.currAvailablePlaces);
  }

  canReserveTrip(): boolean {
    if (this.userService.isCustomer()) {
      return true;
    }
    return false;
  }

  canRateTrip() {
    if (!this.userService.isManager()) {
      return true;
    }
    return false;
  }
}
