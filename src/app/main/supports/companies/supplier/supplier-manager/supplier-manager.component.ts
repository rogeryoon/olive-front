import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveSupplierService } from '../../services/supplier.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveSupplierEditorComponent } from '../supplier-editor/supplier-editor.component';

@Component({
  selector: 'olive-supplier-manager',
  templateUrl: './supplier-manager.component.html',
  styleUrls: ['./supplier-manager.component.scss']
})
export class OliveSupplierManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveSupplierEditorComponent) 
  private supplierEditor: OliveSupplierEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveSupplierService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.supplierEditor);
  }

  getEditedItem(): any {
    const supplier = this.supplierEditor.getEditedItem();
    
    return this.itemWithIdNAudit({
      code: supplier.code,
      name: supplier.name,
      phoneNumber: supplier.phoneNumber,
      email: supplier.email,
      webSite: supplier.webSite,
      address: supplier.address,
      memo: supplier.memo,
      activated: supplier.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
