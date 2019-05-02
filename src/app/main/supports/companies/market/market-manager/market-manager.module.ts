import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveMarketManagerComponent } from './market-manager.component';
import { OliveMarketEditorComponent } from '../market-editor/market-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveMarketManagerComponent,
    OliveMarketEditorComponent
  ],
  exports: [OliveMarketManagerComponent],
  entryComponents: [OliveMarketManagerComponent]
})
export class OliveMarketManagerModule { }
