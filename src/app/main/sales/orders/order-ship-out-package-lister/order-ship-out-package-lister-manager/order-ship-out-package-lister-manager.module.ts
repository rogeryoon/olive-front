import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveOrderShipOutPackageListerManagerComponent } from './order-ship-out-package-lister-manager.component';
import { OliveOrderShipOutPackageListerComponent } from '../order-ship-out-package-lister/order-ship-out-package-lister.component';
import { OliveCheckboxSelectorPanelModule } from 'app/core/components/entries/checkbox-selector-panel/checkbox-selector-panel.module';
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { OlivePendingOrderShipOutPackageListComponent } from '../pending-order-ship-out-package-list/pending-order-ship-out-package-list.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveCheckboxSelectorPanelModule
  ],
  declarations: [
    OliveOrderShipOutPackageListerManagerComponent,
    OliveOrderShipOutPackageListerComponent,
    OlivePendingOrderShipOutListComponent,
    OlivePendingOrderShipOutPackageListComponent
  ],
  providers: [],
  exports: [
  ],
  entryComponents: [
    OliveOrderShipOutPackageListerManagerComponent
  ]
})
export class OliveOrderShipOutPackageListerModule { }
