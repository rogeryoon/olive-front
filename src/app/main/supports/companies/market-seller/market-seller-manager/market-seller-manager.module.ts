import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveMarketSellerManagerComponent } from './market-seller-manager.component';
import { OliveMarketSellerEditorComponent } from '../market-seller-editor/market-seller-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveMarketSellerManagerComponent,
    OliveMarketSellerEditorComponent
  ],
  exports: [OliveMarketSellerManagerComponent],
  entryComponents: [OliveMarketSellerManagerComponent]
})
export class OliveMarketSellerManagerModule { }
