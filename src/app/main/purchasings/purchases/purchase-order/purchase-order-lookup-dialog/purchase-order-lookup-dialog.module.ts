import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';

import { OlivePurchaseOrderLookupDialogComponent } from './purchase-order-lookup-dialog.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [OlivePurchaseOrderLookupDialogComponent],
  exports: [OlivePurchaseOrderLookupDialogComponent],
  entryComponents: [OlivePurchaseOrderLookupDialogComponent]
})
export class OlivePurchaseOrderLookupDialogModule { }
