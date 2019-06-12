import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveMarketItemMappingManagerComponent } from './market-item-mapping-manager.component';
import { OliveMarketItemMappingExcelColumnsEditorComponent } from '../market-item-mapping-excel-columns-editor/market-item-mapping-excel-columns-editor.component';
import { OliveMarketItemMappingProductVariantsEditorComponent } from '../market-item-mapping-product-variants-editor/market-item-mapping-product-variants-editor.component';


@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveMarketItemMappingManagerComponent,
    OliveMarketItemMappingExcelColumnsEditorComponent,
    OliveMarketItemMappingProductVariantsEditorComponent
  ],
  exports: [
    OliveMarketItemMappingManagerComponent,
    OliveMarketItemMappingExcelColumnsEditorComponent,
    OliveMarketItemMappingProductVariantsEditorComponent
  ],
  entryComponents: [
    OliveMarketItemMappingManagerComponent
  ]
})
export class OliveMarketItemMappingManagerModule { }
