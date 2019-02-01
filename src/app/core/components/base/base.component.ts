import { Component, OnInit } from '@angular/core';
import { Currency } from 'app/main/supports/bases/models/currency.model';

@Component({
  selector: 'olive-base',
  template: ''
})
export class OliveBaseComponent implements OnInit {
  protected standCurrency: Currency;
  protected currencies: Currency[];

  constructor() { }

  ngOnInit() {
  }
}
