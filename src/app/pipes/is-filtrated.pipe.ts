import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFiltrated'
})
export class IsFiltratedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
