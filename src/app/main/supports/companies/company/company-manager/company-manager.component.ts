import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveCompanyService } from '../../../services/company.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveCompanyEditorComponent } from '../company-editor/company-editor.component';
import { OliveAddressEditorComponent } from 'app/core/components/entries/address-editor/address-editor.component';

@Component({
  selector: 'olive-company-manager',
  templateUrl: './company-manager.component.html',
  styleUrls: ['./company-manager.component.scss']
})
export class OliveCompanyManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCompanyEditorComponent) 
  private companyEditor: OliveCompanyEditorComponent;

  @ViewChild(OliveAddressEditorComponent) 
  private addressEditorComponent: OliveAddressEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveCompanyService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.companyEditor);
    this.subControls.push(this.addressEditorComponent);
  }

  getEditedItem(): any {
    const company = this.companyEditor.getEditedItem();
    const address = this.addressEditorComponent.getEditedItem();

    return this.itemWithIdNAudit({
      code: company.code,
      name: company.name,
      memo: company.memo,
      phoneNumber: company.phoneNumber,
      activated: company.activated,
      addressFk: address,
      companyGroupId : company.companyGroupFk.id
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
