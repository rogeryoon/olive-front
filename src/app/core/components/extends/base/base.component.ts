import { Component, OnInit } from '@angular/core';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Address } from 'app/core/models/core/address.model';

@Component({
  selector: 'olive-base',
  template: ''
})
export class OliveBaseComponent implements OnInit {
  standCurrency: Currency;
  currencies: Currency[];

  constructor() { }

  ngOnInit() {
  }

  commaNumber(amount: number) {
    return OliveUtilities.numberFormat(amount, 0, null);
  }

  numberFormat(amount: number, digits = 0, zero = null) {
    return OliveUtilities.numberFormat(amount, digits, zero);
  }

  isNull(input: any): boolean {
    return OliveUtilities.testIsUndefined(input);
  }

  id36(input: number): string {
    return OliveUtilities.convertToBase36(input);
  }

  date(input: any): string {
    return OliveUtilities.getShortDate(input);
  }

  moment(input: any): string {
    return OliveUtilities.getMomentDate(input);
  }  

  dateCode(date: any, id: number = 0): string {
    if (id === 0) {
      return OliveUtilities.getDateCode(date);
    }
    else {
      return this.id36(id) + '-' + OliveUtilities.getDateCode(date);
    }
  }

  boolValue(value?: boolean): boolean {
    return value == null ? true : value;
  }

  address(address: Address): string {
    return OliveUtilities.showAddress(address);
  }
}
