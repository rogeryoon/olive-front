import { NgModule } from '@angular/core';

import { OlivePurchasesModule } from './purchases/purchases.module';
import { OliveInWarehousesModule } from './in-warehouses/in-warehouses.module';

@NgModule({
  imports: [
    OlivePurchasesModule,
    OliveInWarehousesModule
  ]
})
export class OlivePurchasingsModule { }
