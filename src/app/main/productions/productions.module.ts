import { NgModule } from '@angular/core';

import { OliveProductsModule } from './products/products.module';
import { OliveInventoriesModule } from './inventories/inventories.module';

@NgModule({
  imports: [
    OliveProductsModule,
    OliveInventoriesModule
  ]
})
export class OliveProductionsModule { }
