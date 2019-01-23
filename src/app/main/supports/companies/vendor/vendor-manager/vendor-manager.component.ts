import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveVendorService } from '../../services/vendor.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/entity-edit/entity-edit.component';
import { OliveVendorEditorComponent } from '../vendor-editor/vendor-editor.component';

@Component({
  selector: 'olive-vendor-manager',
  templateUrl: './vendor-manager.component.html',
  styleUrls: ['./vendor-manager.component.scss']
})
export class OliveVendorManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveVendorEditorComponent) 
  private vendorEditor: OliveVendorEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveVendorService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.vendorEditor);
  }

  getEditedItem(): any {
    const vendor = this.vendorEditor.getEditedItem();
    
    return this.itemWithIdNAudit({
      code: vendor.code,
      name: vendor.name,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      webSite: vendor.webSite,
      address: vendor.address,
      memo: vendor.memo,
      activated: vendor.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
