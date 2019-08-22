import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveCarrierTrackingNumberRangeManagerComponent } from './carrier-tracking-number-range-manager.component';
import { OliveCarrierTrackingNumberRangeEditorComponent } from '../carrier-tracking-number-range-editor/carrier-tracking-number-range-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveCarrierTrackingNumberRangeManagerComponent,
    OliveCarrierTrackingNumberRangeEditorComponent
  ],
  exports: [OliveCarrierTrackingNumberRangeManagerComponent],
  entryComponents: [OliveCarrierTrackingNumberRangeManagerComponent]
})
export class OliveCarrierTrackingNumberRangeManagerModule { }
