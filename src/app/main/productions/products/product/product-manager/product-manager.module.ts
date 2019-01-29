import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductManagerComponent } from './product-manager.component';
import { OliveProductEditorComponent } from '../product-editor/product-editor.component';
import { OliveProductClassEditorComponent } from '../product-class-editor/product-class-editor.component';

@NgModule({
  imports: [
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveProductManagerComponent,
    OliveProductEditorComponent,
    OliveProductClassEditorComponent
  ],
  exports: [OliveProductManagerComponent],
  entryComponents: [OliveProductManagerComponent]
})
export class OliveProductManagerModule { }
