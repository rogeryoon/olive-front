import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveCarrierManagerComponent } from './carrier-manager.component';
import { OliveCarrierEditorComponent } from '../carrier-editor/carrier-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveCarrierManagerComponent,
    OliveCarrierEditorComponent
  ],
  exports: [OliveCarrierManagerComponent],
  entryComponents: [OliveCarrierManagerComponent]
})
export class OliveCarrierManagerModule { }
