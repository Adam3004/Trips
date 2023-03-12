import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservedTripsServiceService {
  amount: number = 0;
  constructor() {}

  getAmount() {
    // console.log(this.amount)
    return this.amount;
  }
  addTrip(number: number): void {
    this.amount += number;
  }
  removeTrip(number: number): void {
    this.amount -= number;
  }
}
