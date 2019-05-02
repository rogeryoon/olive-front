import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveVoidPurchaseOrderManagerComponent } from './void-purchase-order-manager.component';
import { OliveVoidPurchaseOrderEditorComponent } from '../void-purchase-order-editor/void-purchase-order-editor.component';
import { OlivePurchaseOrderService } from 'app/main/purchasings/purchases/services/purchase-order.service';
import { OlivePurchaseOrderLookupDialogModule } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.module';
import { OliveInWarehouseManagerModule } from 'app/main/purchasings/in-warehouses/in-warehouse/in-warehouse-manager/in-warehouse-manager.module';
import { OlivePurchaseOrderManagerModule } from '../../purchase-order/purchase-order-manager/purchase-order-manager.module';
import { OliveVoidPurchaseOrderService } from '../../services/void-purchase-order.service';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OlivePurchaseOrderLookupDialogModule,
    
    OliveInWarehouseManagerModule,
    OlivePurchaseOrderManagerModule
  ],
  declarations: [
    OliveVoidPurchaseOrderManagerComponent,
    OliveVoidPurchaseOrderEditorComponent
  ],
  providers: [],
  exports: [
    OliveVoidPurchaseOrderManagerComponent
  ],
  entryComponents: [
    OliveVoidPurchaseOrderManagerComponent
  ]
})
export class OliveVoidPurchaseOrderManagerModule { }
