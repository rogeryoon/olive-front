import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductCustomsTypeCodesEditorComponent } from './product-customs-type-codes-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductCustomsTypeCodesEditorComponent
  ],
  exports: [OliveProductCustomsTypeCodesEditorComponent],
  entryComponents: [OliveProductCustomsTypeCodesEditorComponent]
})
export class OliveProductCustomsTypeCodesEditorModule { }
