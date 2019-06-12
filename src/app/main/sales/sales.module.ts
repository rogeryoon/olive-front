import { NgModule } from '@angular/core';
import { OliveMarketDatasModule } from './market-datas/market-datas.module';
import { OliveOrdersModule } from './orders/orders.module';

@NgModule({
  imports: [
    OliveMarketDatasModule,
    OliveOrdersModule
  ]
})
export class OliveSalesModule { }
