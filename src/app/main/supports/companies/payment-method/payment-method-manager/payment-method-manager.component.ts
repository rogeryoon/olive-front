import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OlivePaymentMethodService } from '../../../services/payment-method.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OlivePaymentMethodEditorComponent } from '../payment-method-editor/payment-method-editor.component';

@Component({
  selector: 'olive-payment-method-manager',
  templateUrl: './payment-method-manager.component.html',
  styleUrls: ['./payment-method-manager.component.scss']
})
export class OlivePaymentMethodManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OlivePaymentMethodEditorComponent) 
  private paymentMethodEditor: OlivePaymentMethodEditorComponent;

  // @ViewChild(OliveCompanyFkEditorComponent)
  // private companyFkEditor: OliveCompanyFkEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OlivePaymentMethodService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.paymentMethodEditor);
    // this.subControls.push(this.companyFkEditor);
  }

  getEditedItem(): any {
    const paymentMethod = this.paymentMethodEditor.getEditedItem();
    // const companyFk = this.companyFkEditor.getEditedItem();

    return this.itemWithIdNAudit({
      code: paymentMethod.code,
      name: paymentMethod.name,
      memo: paymentMethod.memo,
      activated: paymentMethod.activated,
      // companyFk: companyFk.companyFk
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
