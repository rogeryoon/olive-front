import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { GroupByPipe } from './groupBy.pipe';
import { ShortenPipe } from './shorten.pipe';
import { OliveMoneyPipe } from './money.pipe';
import { OliveNoCommaPipe } from './noComma.pipe';

@NgModule({
   imports: [],
   declarations: [
      GroupByPipe, 
      ShortenPipe, 
      OliveMoneyPipe,
      OliveNoCommaPipe
   ],
   exports: [
      GroupByPipe, 
      ShortenPipe, 
      OliveMoneyPipe,
      OliveNoCommaPipe
   ],
   providers: [
      DecimalPipe
   ]
})
export class OlivePipesModule { }
