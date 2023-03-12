import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeCurrency',
})
export class ChangeCurrencyPipe implements PipeTransform {
  transform(nothing: number, firstValue: number, newCurrency: string): number {
    switch (newCurrency) {
      case 'dolar':
        return parseInt((firstValue * 0.22).toFixed(2));
      case 'euro':
        return parseInt((firstValue * 0.21).toFixed(2));
      default:
        return firstValue;
    }
  }
}
