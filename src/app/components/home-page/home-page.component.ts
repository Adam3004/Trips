import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/services/basket.service';
import { ListOfTripsService } from 'src/app/services/list-of-trips.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  mapUrl: string =
    'https://maps.google.com/maps?q=$KrakowAGHD17&t=&z=7&ie=UTF8&iwloc=&output=embed';

  constructor(
    private userService: UserService,
    private basketService: BasketService,
    private tripsService: ListOfTripsService
  ) {}

  ngOnInit() {
    this.tripsService.ngOnInit();
    setTimeout(() => {
      if (
        this.userService.getSessionUser() !== null &&
        this.basketService.ActiveTrips.length == 0
      ) {
        let sessionUser = this.userService.getSessionUser();
        // console.log(sessionUser, this.tripsService.Trips);
        if (sessionUser) {
          this.basketService.initializeBasket(
            sessionUser,
            this.tripsService.Trips
          );
        }
      }
    }, 800);
  }
}
