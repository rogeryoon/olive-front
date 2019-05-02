import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OlivePurchaseOrderManagerComponent } from './purchase-order-manager.component';
import { OlivePurchaseOrderEditorComponent } from '../purchase-order-editor/purchase-order-editor.component';
import { OlivePurchaseOrderItemsEditorComponent } from '../purchase-order-items-editor/purchase-order-items-editor.component';
import { OlivePurchaseOrderPaymentsEditorComponent } from '../purchase-order-payments-editor/purchase-order-payments-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OlivePurchaseOrderManagerComponent,
    OlivePurchaseOrderEditorComponent,
    OlivePurchaseOrderPaymentsEditorComponent,
    OlivePurchaseOrderItemsEditorComponent
  ],
  providers: [],
  exports: [
    OlivePurchaseOrderManagerComponent,
    OlivePurchaseOrderPaymentsEditorComponent
  ],
  entryComponents: [
    OlivePurchaseOrderManagerComponent
  ]
})
export class OlivePurchaseOrderManagerModule { }
