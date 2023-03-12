import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketElement } from '../../models/basketElement';
import { CurrencyService } from '../../services/currency.service';
import { ListOfTripsService } from '../../services/list-of-trips.service';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent {
  showBasket: boolean = true;

  constructor(
    public basketService: BasketService,
    public currencyService: CurrencyService,
    private listOfTripsService: ListOfTripsService,
  ) {}

  showValue(): string {
    let val = this.currencyService.currency;
    if (val == 'dolar') {
      return 'dolars';
    }
    return val;
  }

  buyTrip(tripToBuy: BasketElement): void {
    this.listOfTripsService.buyTrip(
      tripToBuy.amount,
      tripToBuy.tripName,
      tripToBuy.price,
      tripToBuy.imgLink
    );
  }
}
