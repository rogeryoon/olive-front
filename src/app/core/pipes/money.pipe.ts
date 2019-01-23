import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'money'
})
export class OliveMoneyPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe
  ) {}

  transform(value: any, args?: any): any {
    if (!args) {
      return this.decimalPipe.transform(value, '1.2-2');
    }

    return this.decimalPipe.transform(value, args);
  }
}
