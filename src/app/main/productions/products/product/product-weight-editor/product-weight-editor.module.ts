import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductWeightEditorComponent } from './product-weight-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductWeightEditorComponent
  ],
  exports: [OliveProductWeightEditorComponent],
  entryComponents: [OliveProductWeightEditorComponent]
})
export class OliveProductWeightEditorModule { }
