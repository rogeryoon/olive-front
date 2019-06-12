import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveWarehouseService } from '../../../services/warehouse.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveWarehouseEditorComponent } from '../warehouse-editor/warehouse-editor.component';

@Component({
  selector: 'olive-warehouse-manager',
  templateUrl: './warehouse-manager.component.html',
  styleUrls: ['./warehouse-manager.component.scss']
})
export class OliveWarehouseManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveWarehouseEditorComponent) 
  private warehouseEditor: OliveWarehouseEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveWarehouseService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.warehouseEditor);
  }

  getEditedItem(): any {
    const warehouse = this.warehouseEditor.getEditedItem();

    return this.itemWithIdNAudit({
      code: warehouse.code,
      name: warehouse.name,
      companyId: warehouse.companyId,
      CompanyFk: null,
      companyMasterBranchId: warehouse.companyMasterBranchId,
      CompanyMasterBranchFk: null,
      activated: warehouse.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
