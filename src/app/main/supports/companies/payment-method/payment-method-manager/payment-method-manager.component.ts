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
import { OliveCacheService } from 'app/core/services/cache.service';

@Component({
  selector: 'olive-payment-method-manager',
  templateUrl: './payment-method-manager.component.html',
  styleUrls: ['./payment-method-manager.component.scss']
})
export class OlivePaymentMethodManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OlivePaymentMethodEditorComponent) 
  private paymentMethodEditor: OlivePaymentMethodEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder,  
    dataService: OlivePaymentMethodService, private cacheService: OliveCacheService
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
  }

  getEditedItem(): any {
    const paymentMethod = this.paymentMethodEditor.getEditedItem();

    this.cacheService.invalidateCaches(OliveCacheService.cacheKeys.getItemsKey.paymentMethod);    

    return this.itemWithIdNAudit({
      code: paymentMethod.code,
      name: paymentMethod.name,
      memo: paymentMethod.memo,
      activated: paymentMethod.activated,
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
