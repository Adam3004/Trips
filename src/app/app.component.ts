import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BasketService } from './services/basket.service';
import { ListOfTripsService } from './services/list-of-trips.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'trips';
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private basketService: BasketService,
    private tripsService: ListOfTripsService
  ) {}

  ngOnInit(): void {
    this.tripsService.ngOnInit()
    setTimeout(() => {
      let sessionUser = this.userService.getSessionUser();
      console.log(sessionUser, this.tripsService.Trips)
      if (sessionUser) {
        this.basketService.initializeBasket(
          sessionUser,
          this.tripsService.Trips
        );
      }
    },500);
  }
}
