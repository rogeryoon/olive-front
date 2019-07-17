import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveCheckboxSelectorPanelComponent } from './checkbox-selector-panel.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
  ],
  declarations: [OliveCheckboxSelectorPanelComponent],
  exports: [OliveCheckboxSelectorPanelComponent]
})
export class OliveCheckboxSelectorPanelModule { }
