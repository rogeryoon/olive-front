import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductVariantLookupDialogComponent } from './product-variant-lookup-dialog.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [OliveProductVariantLookupDialogComponent],
  exports: [OliveProductVariantLookupDialogComponent],
  entryComponents: [OliveProductVariantLookupDialogComponent]
})
export class OliveProductVariantLookupDialogModule { }
