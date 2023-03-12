import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currency:string = 'zl'
  constructor() { }
  changeCurrency(newCurrency:string):void {
    this.currency = newCurrency;
  }
}
