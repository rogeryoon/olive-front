import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { NgxBarcodeModule } from 'ngx-barcode';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveOrderShipOutPackageListerManagerComponent } from './order-ship-out-package-lister-manager.component';
import { OliveOrderShipOutPackageListerComponent } from '../order-ship-out-package-lister/order-ship-out-package-lister.component';
import { OliveCheckboxSelectorPanelModule } from 'app/core/components/entries/checkbox-selector-panel/checkbox-selector-panel.module';
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { OlivePendingOrderShipOutPackageListComponent } from '../pending-order-ship-out-package-list/pending-order-ship-out-package-list.component';
import { OliveProductWeightEditorModule } from 'app/main/productions/products/product/product-weight-editor/product-weight-editor.module';
import { OliveProductCustomsPriceEditorModule } from 'app/main/productions/products/product/product-customs-price-editor/product-customs-price-editor.module';
import { OlivePreviewPickingListComponent } from '../preview-picking-list/preview-picking-list.component';
import { OlivePreviewPackingListComponent } from '../preview-packing-list/preview-packing-list.component';
import { OliveProductHsCodesEditorModule } from 'app/main/productions/products/product/product-hs-codes-editor/product-hs-codes-editor.module';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),
    NgxBarcodeModule,

    OliveSharedModule,
    OliveCheckboxSelectorPanelModule,
    OliveProductWeightEditorModule,
    OliveProductCustomsPriceEditorModule,
    OliveProductHsCodesEditorModule
  ],
  declarations: [
    OliveOrderShipOutPackageListerManagerComponent,
    OliveOrderShipOutPackageListerComponent,
    OlivePendingOrderShipOutListComponent,
    OlivePendingOrderShipOutPackageListComponent,
    OlivePreviewPickingListComponent,
    OlivePreviewPackingListComponent
  ],
  providers: [],
  exports: [
  ],
  entryComponents: [
    OliveOrderShipOutPackageListerManagerComponent,
    OlivePreviewPickingListComponent,
    OlivePreviewPackingListComponent
  ]
})
export class OliveOrderShipOutPackageListerModule { }
