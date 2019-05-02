import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductVariantManagerComponent } from './product-variant-manager.component';
import { OliveProductVariantEditorComponent } from '../product-variant-editor/product-variant-editor.component';
import { OliveProductService } from '../../services/product.service';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductVariantManagerComponent,
    OliveProductVariantEditorComponent
  ],
  providers: [],
  entryComponents: [OliveProductVariantManagerComponent]
})
export class OliveProductVariantManagerModule { }
