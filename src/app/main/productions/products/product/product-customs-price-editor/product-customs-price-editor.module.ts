import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductCustomsPriceEditorComponent } from './product-customs-price-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductCustomsPriceEditorComponent
  ],
  exports: [OliveProductCustomsPriceEditorComponent],
  entryComponents: [OliveProductCustomsPriceEditorComponent]
})
export class OliveProductCustomsPriceEditorModule { }
