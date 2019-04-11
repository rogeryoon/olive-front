import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveVoidPurchaseOrderManagerComponent } from './void-purchase-order-manager.component';
import { OliveVoidPurchaseOrderEditorComponent } from '../void-purchase-order-editor/void-purchase-order-editor.component';
import { OliveVoidPurchaseOrderItemsEditorComponent } from '../void-purchase-order-items-editor/void-purchase-order-items-editor.component';
import { OliveWarehouseService } from 'app/main/supports/companies/services/warehouse.service';
import { OlivePurchaseOrderService } from 'app/main/purchasings/purchases/services/purchase-order.service';
import { OlivePurchaseOrderLookupDialogModule } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.module';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OlivePurchaseOrderLookupDialogModule,
  ],
  declarations: [
    OliveVoidPurchaseOrderManagerComponent,
    OliveVoidPurchaseOrderEditorComponent,
    OliveVoidPurchaseOrderItemsEditorComponent
  ],
  providers: [
    OliveWarehouseService,
    OlivePurchaseOrderService
  ],
  exports: [
    OliveVoidPurchaseOrderManagerComponent
  ],
  entryComponents: [
    OliveVoidPurchaseOrderManagerComponent
  ]
})
export class OliveVoidPurchaseOrderManagerModule { }
