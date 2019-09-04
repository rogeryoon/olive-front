import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveOrderShipOutManagerComponent } from './order-ship-out-manager.component';
import { OliveOrderShipOutEditorComponent } from '../order-ship-out-editor/order-ship-out-editor.component';
import { OliveOrderShipOutDetailsEditorComponent } from './order-ship-out-details-editor/order-ship-out-details-editor.component';
import { OliveOrderShipOutTrackingEditorComponent } from '../order-ship-out-tracking-editor/order-ship-out-tracking-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveOrderShipOutManagerComponent,
    OliveOrderShipOutEditorComponent,
    OliveOrderShipOutDetailsEditorComponent,
    OliveOrderShipOutTrackingEditorComponent
  ],
  exports: [
    OliveOrderShipOutManagerComponent,
    OliveOrderShipOutDetailsEditorComponent,
    OliveOrderShipOutTrackingEditorComponent
  ],
  entryComponents: [OliveOrderShipOutManagerComponent]
})
export class OliveOrderShipOutManagerModule { }
