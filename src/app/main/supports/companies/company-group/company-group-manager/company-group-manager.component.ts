import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveCompanyGroupService } from '../../services/company-group.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveCompanyGroupEditorComponent } from '../company-group-editor/company-group-editor.component';
import { OliveCompanyGroupSettingEditorComponent } from '../../company-group-setting/company-group-setting-editor/company-group-setting-editor.component';

@Component({
  selector: 'olive-company-group-manager',
  templateUrl: './company-group-manager.component.html',
  styleUrls: ['./company-group-manager.component.scss']
})
export class OliveCompanyGroupManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCompanyGroupEditorComponent) 
  private companyGroupEditor: OliveCompanyGroupEditorComponent;

  @ViewChild(OliveCompanyGroupSettingEditorComponent) 
  private companyGroupSettingEditor: OliveCompanyGroupSettingEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveCompanyGroupService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.companyGroupEditor);
    this.subControls.push(this.companyGroupSettingEditor);
  }

  getEditedItem(): any {
    const group = this.companyGroupEditor.getEditedItem();
    const setting = this.companyGroupSettingEditor.getEditedItem();
    
    return this.itemWithIdNAudit({
      name: group.name,
      memo: group.memo,
      activated: group.activated,
      companyGroupSettingFk: setting
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
