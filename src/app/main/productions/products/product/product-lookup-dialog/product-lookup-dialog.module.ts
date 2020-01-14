import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductLookupDialogComponent } from './product-lookup-dialog.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [OliveProductLookupDialogComponent],
  exports: [OliveProductLookupDialogComponent],
  entryComponents: [OliveProductLookupDialogComponent]
})
export class OliveProductLookupDialogModule { }
