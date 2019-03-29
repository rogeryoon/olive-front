import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveCurrencyService } from '../../services/currency.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveCurrencyEditorComponent } from '../currency-editor/currency-editor.component';

@Component({
  selector: 'olive-currency-manager',
  templateUrl: './currency-manager.component.html',
  styleUrls: ['./currency-manager.component.scss']
})
export class OliveCurrencyManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCurrencyEditorComponent) 
  private currencyEditor: OliveCurrencyEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveCurrencyService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.currencyEditor);
  }

  getEditedItem(): any {
    const currency = this.currencyEditor.getEditedItem();
    return this.itemWithIdNAudit({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      decimalPoint: currency.decimalPoint,
      activated: currency.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
