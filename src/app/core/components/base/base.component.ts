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

  numberFormat(amount: number, digits = 0, zero = null) {
    return OliveUtilities.numberFormat(amount, digits, zero);
  }

  id36(input: number): string {
    return OliveUtilities.convertToBase36(input);
  }

  date(input: any): string {
    return OliveUtilities.getShortDate(input);
  }

  boolValue(value?: boolean): boolean {
    return value == null ? true : value;
  }

  address(address: Address): string {
    return OliveUtilities.showAddress(address);
  }
}
