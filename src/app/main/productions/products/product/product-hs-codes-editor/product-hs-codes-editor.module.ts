import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductHsCodesEditorComponent } from './product-hs-codes-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductHsCodesEditorComponent
  ],
  exports: [OliveProductHsCodesEditorComponent],
  entryComponents: [OliveProductHsCodesEditorComponent]
})
export class OliveProductHsCodesEditorModule { }
