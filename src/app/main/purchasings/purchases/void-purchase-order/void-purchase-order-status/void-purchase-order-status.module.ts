import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';

import { OliveVoidPurchaseOrderStatusComponent } from './void-purchase-order-status.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [OliveVoidPurchaseOrderStatusComponent],
  exports: [OliveVoidPurchaseOrderStatusComponent],
  entryComponents: [OliveVoidPurchaseOrderStatusComponent]
})
export class OliveInWarehouseStatusModule { }
