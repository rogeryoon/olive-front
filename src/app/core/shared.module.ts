import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DataTablesModule } from 'angular-datatables';

import { OlivePipesModule } from './pipes/pipes.module';
import { OliveMaterialModule } from './modules/material.module';
import { OliveAppDialogComponent } from './components/dialogs/app-dialog/app-dialog.component';
import { OliveImportFileDialogComponent } from './components/dialogs/import-file-dialog/import-file-dialog.component';
import { OliveDocumentService } from './services/document.service';
import { OliveMessageHelperService } from './services/message-helper.service';
import { OliveCacheService } from './services/cache.service';
import { OliveSearchDialogComponent } from './components/dialogs/search-dialog/search-dialog.component';
import { OliveEntityListComponent } from './components/extends/entity-list/entity-list.component';
import { OliveLookupDialogComponent } from './components/dialogs/lookup-dialog/lookup-dialog.component';
import { OliveEditDialogComponent } from './components/dialogs/edit-dialog/edit-dialog.component';
import { OliveEntityEditComponent } from './components/extends/entity-edit/entity-edit.component';
import { OliveEntityDateComponent } from './components/entries/entity-date/entity-date.component';
import { OliveEntityFormComponent } from './components/extends/entity-form/entity-form.component';
import { OliveEntityFormBaseComponent } from './components/extends/entity-form-base/entity-form-base.component';
import { OliveEntityEndpointService } from './services/entity-endpoint.service';
import { OliveAddressEditorComponent } from './components/entries/address-editor/address-editor.component';
import { OliveLookupHostComponent } from './components/entries/lookup-host/lookup-host.component';
import { OliveChipInputComponent } from './components/entries/chip-input/chip-input.component';
import { OliveChunkDataService } from './services/chunk-data.service';
import { OliveQueryParameterService } from './services/query-parameter.service';
import { OliveCompanyGroupSettingService } from './services/company-group-setting.service';
import { OliveCompanyMasterService } from './services/company-master.service';
import { OliveCurrencyService } from 'app/main/supports/bases/services/currency.service';
import { OliveEditPageComponent } from './components/extends/edit-page/edit-page.component';
import { OlivePlaceHolderDirective } from './directives/place-holder.directive';
import { OliveBaseComponent } from './components/extends/base/base.component';
import { OliveEndpointBaseService } from './services/endpoint-base.service';
import { OlivePreviewDialogComponent } from './components/dialogs/preview-dialog/preview-dialog.component';
import { OliveViewDialogComponent } from './components/dialogs/view-dialog/view-dialog.component';
import { OliveTabLabelComponent } from './components/entries/tab-label/tab-label.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    TranslateModule.forChild(),

    DataTablesModule,

    OlivePipesModule,
    OliveMaterialModule
  ],
  exports: [
    DataTablesModule,
    
    OlivePipesModule,
    OliveMaterialModule,

    OliveBaseComponent,
    OliveEntityListComponent,
    OliveEntityEditComponent,
    OliveEntityDateComponent,
    OliveEntityFormComponent,
    OliveEntityFormBaseComponent,
    OliveLookupHostComponent,
    OliveChipInputComponent,
    
    OliveImportFileDialogComponent,
    OliveSearchDialogComponent,
    OliveLookupDialogComponent,
    OliveEditDialogComponent,
    OlivePreviewDialogComponent,
    OliveViewDialogComponent,
  
    OliveAddressEditorComponent,
    OliveEditPageComponent,
    OliveTabLabelComponent,

    OlivePlaceHolderDirective
  ],
  declarations: [
    OliveBaseComponent,
    OliveEntityListComponent,
    OliveEntityEditComponent,
    OliveEntityDateComponent,
    OliveEntityFormComponent,
    OliveEntityFormBaseComponent,
    OliveLookupHostComponent,
    OliveChipInputComponent,

    OliveAppDialogComponent,
    OliveImportFileDialogComponent,
    OliveSearchDialogComponent,
    OliveLookupDialogComponent,
    OliveEditDialogComponent,
    OlivePreviewDialogComponent,
    OliveViewDialogComponent,

    OliveAddressEditorComponent,
    OliveEditPageComponent,
    OliveTabLabelComponent,

    OlivePlaceHolderDirective
  ],
  providers: [
    OliveDocumentService,
    OliveMessageHelperService,
    OliveCacheService,
    OliveEndpointBaseService,
    OliveEntityEndpointService,
    OliveChunkDataService,
    OliveQueryParameterService,
    OliveCompanyGroupSettingService,
    OliveCompanyMasterService,
    OliveCurrencyService,
  ],
  entryComponents: [
    OliveAppDialogComponent,
    OliveImportFileDialogComponent,
    OliveSearchDialogComponent,
    OliveLookupDialogComponent,
    OliveEditDialogComponent,
    OlivePreviewDialogComponent,
    OliveViewDialogComponent
  ]
})
export class OliveSharedModule { }
