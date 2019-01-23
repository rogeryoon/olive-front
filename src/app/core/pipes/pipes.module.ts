import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { GroupByPipe } from './groupBy.pipe';
import { ShortenPipe } from './shorten.pipe';
import { OliveMoneyPipe } from './money.pipe';
// import { OliveNoCommaPipe } from './NoComma.pipe';

const PIPES = [
  GroupByPipe, ShortenPipe, OliveMoneyPipe /*, OliveNoCommaPipe */
];

@NgModule({
   imports: [],
   declarations: PIPES,
   exports: PIPES,
   providers: [
      DecimalPipe
   ]
})
export class OlivePipesModule { }
