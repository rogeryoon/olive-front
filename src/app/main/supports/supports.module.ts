import { NgModule } from '@angular/core';

import { OliveHelpModule } from './helps/helps.module';
import { OliveCompaniesModule } from './companies/companies.module';
import { OliveBasesModule } from './bases/bases.module';

@NgModule({
  imports: [
    OliveHelpModule,
    OliveCompaniesModule,
    OliveBasesModule
  ]
})
export class OliveSupportsModule { }
