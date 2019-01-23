import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveCurrenciesComponent } from './currency/currencies.component';
import { OliveCurrencyManagerComponent } from './currency/currency-manager/currency-manager.component';
import { OliveCurrencyEditorComponent } from './currency/currency-editor/currency-editor.component';
import { OliveSearchCurrencyComponent } from './currency/search-currency/search-currency.component';
import { OliveCountriesComponent } from './country/countries.component';
import { OliveCountryManagerComponent } from './country/country-manager/country-manager.component';
import { OliveCountryEditorComponent } from './country/country-editor/country-editor.component';
import { OliveSearchCountryComponent } from './country/search-country/search-country.component';
import { OliveCountryService } from './services/country.service';

const routes = [
  {
    path: 'country',
    component: OliveCountriesComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'currency',
    component: OliveCurrenciesComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveCurrenciesComponent,
    OliveCurrencyManagerComponent,    
    OliveCurrencyEditorComponent,
    OliveSearchCurrencyComponent,

    OliveCountriesComponent,
    OliveCountryManagerComponent,    
    OliveCountryEditorComponent,
    OliveSearchCountryComponent    
  ],
  providers: [
    OliveCountryService
  ],
  entryComponents: [
    OliveCurrencyManagerComponent,    
    OliveSearchCurrencyComponent,
    OliveCountryManagerComponent,    
    OliveSearchCountryComponent 
  ]
})
export class OliveBasesModule { }
