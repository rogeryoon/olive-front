﻿import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveCountryService } from '../../../services/country.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveCountryEditorComponent } from '../country-editor/country-editor.component';
import { OliveCacheService } from 'app/core/services/cache.service';

@Component({
  selector: 'olive-country-manager',
  templateUrl: './country-manager.component.html',
  styleUrls: ['./country-manager.component.scss']
})
export class OliveCountryManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCountryEditorComponent) 
  private countryEditor: OliveCountryEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, dataService: OliveCountryService,
    private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.countryEditor);
  }

  getEditedItem(): any {
    const country = this.countryEditor.getEditedItem();

    this.cacheService.invalidateCaches(OliveCacheService.cacheKeys.getItemsKey.country);

    return this.itemWithIdNAudit({
      code: country.code,
      name: country.name,
      activated: country.activated,
      isShipOutCountry: country.isShipOutCountry
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
