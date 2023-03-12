import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiggestSmallestPriceService {
  biggestPrice?: number;
  smallestPrice?: number;
  constructor() {}

  setPrice(option: string, price: number): void {
    if (option == 'biggest') {
      this.biggestPrice = price;
    } else if (option == 'smallest') {
      this.smallestPrice = price;
    }
  }
}
