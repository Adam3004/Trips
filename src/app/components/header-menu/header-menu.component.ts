import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from 'src/app/enums/roles';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ListOfTripsService } from 'src/app/services/list-of-trips.service';
import { UserService } from 'src/app/services/user.service';
import { BasketService } from '../../services/basket.service';
import { BoughtTripsService } from '../../services/bought-trips.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css'],
})
export class HeaderMenuComponent {
  menuIsOpen: boolean = false;
  locations: string[] = [
    'home',
    'trips',
    'manager',
    'basket',
    'owned',
    'settings',
  ];
  tripsCommingSoon: boolean = false;
  sessionUser!: User | null;
  email: string = '';
  // someUser: User | undefined;
  constructor(
    private router: Router,
    public basketService: BasketService,
    public currencyService: CurrencyService,
    public boughtTripsService: BoughtTripsService,
    public authService: AuthService,
    private userService: UserService
  ) {
    // this.authService
    //   .getUser()
    //   .subscribe((user: User | undefined) => (this.someUser = user));
  }

  openMenu(): void {
    // console.log(this.basketService.numberOfReservations)
    this.menuIsOpen = !this.menuIsOpen;
  }

  navigateTo(location: string): void {
    this.router.navigateByUrl(`/${location}`);
  }
  showValue(): string {
    let val = this.currencyService.currency;
    if (val == 'dolar') {
      return 'dolars';
    }
    return val;
  }

  logout() {
    this.basketService.clearBasketAfterSignOut();
    this.authService.logout();
  }

  isVisible(option: string): boolean {
    const sessionUser = this.userService.getSessionUser();
    if (!sessionUser) {
      return false;
    }
    switch (option) {
      case 'manager':
        if (
          sessionUser.roles.indexOf(Roles.ADMINISTRATOR) != -1 ||
          sessionUser.roles.indexOf(Roles.MODERATOR) != -1
        ) {
          return true;
        }
        return false;
      case 'basket':
        if (
          sessionUser.roles.indexOf(Roles.CUSTOMER) != -1
        ) {
          return true;
        }
        return false;
      case 'owned':
        if (
          sessionUser.roles.indexOf(Roles.CUSTOMER) != -1
        ) {
          return true;
        }
        return false;
      case 'settings':
        if (sessionUser.roles.indexOf(Roles.ADMINISTRATOR) != -1) {
          return true;
        }
        return false;

      default:
        return true;
    }
  }
}
