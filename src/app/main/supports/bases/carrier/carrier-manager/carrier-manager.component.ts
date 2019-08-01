import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveCarrierService } from '../../../services/carrier.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveCarrierEditorComponent } from '../carrier-editor/carrier-editor.component';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { Carrier } from '../../../models/carrier.model';

@Component({
  selector: 'olive-carrier-manager',
  templateUrl: './carrier-manager.component.html',
  styleUrls: ['./carrier-manager.component.scss']
})
export class OliveCarrierManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCarrierEditorComponent) 
  private carrierEditor: OliveCarrierEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveCarrierService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.carrierEditor);
  }

  getEditedItem(): any {
    const carrier = this.carrierEditor.getEditedItem();

    return this.itemWithIdNAudit({
      code: carrier.code,
      name: carrier.name,
      webSite: carrier.webSite,
      memo: carrier.memo,
      activated: carrier.activated,
      standCarrierId: carrier.standCarrierId
    } as Carrier);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
