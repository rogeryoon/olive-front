import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductVariantManagerComponent } from './product-variant-manager.component';
import { OliveProductVariantEditorComponent } from '../product-variant-editor/product-variant-editor.component';
import { OliveProductLookupDialogModule } from '../../product/product-lookup-dialog/product-lookup-dialog.module';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveProductLookupDialogModule
  ],
  declarations: [
    OliveProductVariantManagerComponent,
    OliveProductVariantEditorComponent
  ],
  providers: [],
  entryComponents: [OliveProductVariantManagerComponent]
})
export class OliveProductVariantManagerModule { }
