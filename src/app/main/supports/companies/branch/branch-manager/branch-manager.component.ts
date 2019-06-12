import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveBranchService } from '../../../services/branch.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveBranchEditorComponent } from '../branch-editor/branch-editor.component';
import { OliveAddressEditorComponent } from 'app/core/components/entries/address-editor/address-editor.component';

@Component({
  selector: 'olive-branch-manager',
  templateUrl: './branch-manager.component.html',
  styleUrls: ['./branch-manager.component.scss']
})
export class OliveBranchManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveBranchEditorComponent) 
  private branchEditor: OliveBranchEditorComponent;

  @ViewChild(OliveAddressEditorComponent) 
  private addressEditorComponent: OliveAddressEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveBranchService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.branchEditor);
    this.subControls.push(this.addressEditorComponent);
  }

  getEditedItem(): any {
    const branch = this.branchEditor.getEditedItem();
    const address = this.addressEditorComponent.getEditedItem();

    return this.itemWithIdNAudit({
      code: branch.code,
      name: branch.name,
      outsourcing: branch.outsourcing,
      private: branch.private,
      activated: branch.activated,
      phoneNumber: branch.phoneNumber,
      faxNumber: branch.faxNumber,
      email: branch.email,
      weekdayBusinessHours: branch.weekdayBusinessHours,
      weekendBusinessHours: branch.weekendBusinessHours,
      addressFk: address
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
