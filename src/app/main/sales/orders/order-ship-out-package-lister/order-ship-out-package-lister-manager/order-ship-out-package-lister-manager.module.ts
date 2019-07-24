import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveOrderShipOutPackageListerManagerComponent } from './order-ship-out-package-lister-manager.component';
import { OliveOrderShipOutPackageListerComponent } from '../order-ship-out-package-lister/order-ship-out-package-lister.component';
import { OliveCheckboxSelectorPanelModule } from 'app/core/components/entries/checkbox-selector-panel/checkbox-selector-panel.module';
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { OlivePendingOrderShipOutPackageListComponent } from '../pending-order-ship-out-package-list/pending-order-ship-out-package-list.component';
import { OliveProductWeightEditorModule } from 'app/main/productions/products/product/product-weight-editor/product-weight-editor.module';
import { OliveProductCustomsPriceEditorModule } from 'app/main/productions/products/product/product-customs-price-editor/product-customs-price-editor.module';
import { OlivePreviewPurchaseOrderComponent } from 'app/main/purchasings/purchases/purchase-order/preview-purchase-order/preview-purchase-order.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveCheckboxSelectorPanelModule,
    OliveProductWeightEditorModule,
    OliveProductCustomsPriceEditorModule
  ],
  declarations: [
    OliveOrderShipOutPackageListerManagerComponent,
    OliveOrderShipOutPackageListerComponent,
    OlivePendingOrderShipOutListComponent,
    OlivePendingOrderShipOutPackageListComponent,
    OlivePreviewPurchaseOrderComponent
  ],
  providers: [],
  exports: [
  ],
  entryComponents: [
    OliveOrderShipOutPackageListerManagerComponent,
    OlivePreviewPurchaseOrderComponent
  ]
})
export class OliveOrderShipOutPackageListerModule { }
