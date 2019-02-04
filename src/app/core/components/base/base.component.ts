import { Component, OnInit } from '@angular/core';
import { Currency } from 'app/main/supports/bases/models/currency.model';

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
}
