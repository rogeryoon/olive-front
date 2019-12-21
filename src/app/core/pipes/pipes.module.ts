import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { GroupByPipe } from './groupBy.pipe';
import { ShortenPipe } from './shorten.pipe';
import { OliveNoCommaPipe } from './noComma.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

@NgModule({
   imports: [],
   declarations: [
      GroupByPipe, 
      ShortenPipe, 
      OliveNoCommaPipe,
      SanitizeHtmlPipe
   ],
   exports: [
      GroupByPipe, 
      ShortenPipe, 
      OliveNoCommaPipe,
      SanitizeHtmlPipe
   ],
   providers: [
      DecimalPipe
   ]
})
export class OlivePipesModule { }
