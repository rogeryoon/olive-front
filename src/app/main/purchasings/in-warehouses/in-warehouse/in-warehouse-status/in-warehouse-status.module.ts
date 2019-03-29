import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';

import { OliveInWarehouseStatusComponent } from './in-warehouse-status.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [OliveInWarehouseStatusComponent],
  exports: [OliveInWarehouseStatusComponent],
  entryComponents: [OliveInWarehouseStatusComponent]
})
export class OliveInWarehouseStatusModule { }
