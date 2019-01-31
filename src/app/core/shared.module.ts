import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DataTablesModule } from 'angular-datatables';

import { OlivePipesModule } from './pipes/pipes.module';
import { OliveMaterialModule } from './modules/material.module';
import { OliveAppDialogComponent } from './components/app-dialog/app-dialog.component';
import { OliveImportFileDialogComponent } from './components/import-file-dialog/import-file-dialog.component';
import { OliveDocumentService } from './services/document.service';
import { OliveMessageHelperService } from './services/message-helper.service';
import { OliveCacheService } from './services/cache.service';
import { OliveSearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { OliveEntityListComponent } from './components/entity-list/entity-list.component';
import { OliveLookupDialogComponent } from './components/lookup-dialog/lookup-dialog.component';
import { OliveEditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { OliveEntityEditComponent } from './components/entity-edit/entity-edit.component';
import { OliveEntityDateComponent } from './components/entity-date/entity-date.component';
import { OliveUserNameService } from './services/user-name.service';
import { OliveEntityFormComponent } from './components/entity-edit/entity-form.component';
import { OliveEntityFormBaseComponent } from './components/entity-edit/entity-form-base.component';
import { OliveTabLabelComponent } from './components/tab-label/tab-label.component';
import { OliveEntityEndpointService } from './services/entity-endpoint.service';
import { OliveAddressEditorComponent } from './components/editor/address-editor/address-editor.component';
import { OliveLookupHostComponent } from './components/lookup-host/lookup-host.component';
import { OliveChipInputComponent } from './components/chip-input/chip-input.component';
import { OliveChunkDataEndpointService, OliveChunkDataService } from './services/chunk-data.service';
import { OliveEntityListEditComponent } from './components/entity-list-edit/entity-list-edit.component';
import { OliveQueryParameterService } from './services/query-parameter.service';
import { OliveCompanyGroupSettingService } from './services/company-group-setting.service';
import { OliveCompanyMasterService } from './services/company-master.service';
import { OliveCurrencyService } from 'app/main/supports/bases/services/currency.service';
import { OliveEditPageComponent } from './components/edit-page/edit-page.component';
import { OliveOnlyNumberDirective } from './directives/only-number.directive';
import { OlivePlaceHolderDirective } from './directives/place-holder.directive';
import { OliveBaseComponent } from './components/base/base.component';

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
    OliveTabLabelComponent,
    OliveLookupHostComponent,
    OliveChipInputComponent,
    OliveEntityListEditComponent,
    
    OliveImportFileDialogComponent,
    OliveSearchDialogComponent,
    OliveLookupDialogComponent,
    OliveEditDialogComponent,
  
    OliveAddressEditorComponent,
    OliveEditPageComponent,

    OlivePlaceHolderDirective,
    OliveOnlyNumberDirective
  ],
  declarations: [
    OliveBaseComponent,
    OliveEntityListComponent,
    OliveEntityEditComponent,
    OliveEntityDateComponent,
    OliveEntityFormComponent,
    OliveEntityFormBaseComponent,
    OliveTabLabelComponent,
    OliveLookupHostComponent,
    OliveChipInputComponent,
    OliveEntityListEditComponent,

    OliveAppDialogComponent,
    OliveImportFileDialogComponent,
    OliveSearchDialogComponent,
    OliveLookupDialogComponent,
    OliveEditDialogComponent,

    OliveAddressEditorComponent,
    OliveEditPageComponent,

    OlivePlaceHolderDirective,
    OliveOnlyNumberDirective
  ],
  providers: [
    OliveDocumentService,
    OliveMessageHelperService,
    OliveCacheService,
    OliveUserNameService,
    OliveEntityEndpointService,
    OliveChunkDataEndpointService,
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
    OliveEditDialogComponent
  ]
})
export class OliveSharedModule { }
