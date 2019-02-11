import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { GroupByPipe } from './groupBy.pipe';
import { ShortenPipe } from './shorten.pipe';
import { OliveNoCommaPipe } from './noComma.pipe';

@NgModule({
   imports: [],
   declarations: [
      GroupByPipe, 
      ShortenPipe, 
      OliveNoCommaPipe
   ],
   exports: [
      GroupByPipe, 
      ShortenPipe, 
      OliveNoCommaPipe
   ],
   providers: [
      DecimalPipe
   ]
})
export class OlivePipesModule { }
