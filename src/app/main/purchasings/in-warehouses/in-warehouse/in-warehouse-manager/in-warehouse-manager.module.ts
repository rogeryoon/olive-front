import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveInWarehouseManagerComponent } from './in-warehouse-manager.component';
import { OliveInWarehouseEditorComponent } from '../in-warehouse-editor/in-warehouse-editor.component';
import { OliveInWarehouseItemsEditorComponent } from '../in-warehouse-items-editor/in-warehouse-items-editor.component';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { OlivePurchaseOrderService } from 'app/main/purchasings/services/purchase-order.service';
import { OlivePurchaseOrderLookupDialogModule } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.module';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OlivePurchaseOrderLookupDialogModule,
  ],
  declarations: [
    OliveInWarehouseManagerComponent,
    OliveInWarehouseEditorComponent,
    OliveInWarehouseItemsEditorComponent
  ],
  providers: [],
  exports: [
    OliveInWarehouseManagerComponent,
    OliveInWarehouseItemsEditorComponent
  ],
  entryComponents: [
    OliveInWarehouseManagerComponent
  ]
})
export class OliveInWarehouseManagerModule { }
