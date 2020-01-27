import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMarketService } from '../../../services/market.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveMarketEditorComponent } from '../market-editor/market-editor.component';
import { Market } from '../../../models/market.model';
import { OliveCacheService } from 'app/core/services/cache.service';

@Component({
  selector: 'olive-market-manager',
  templateUrl: './market-manager.component.html',
  styleUrls: ['./market-manager.component.scss']
})
export class OliveMarketManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveMarketEditorComponent) 
  private marketEditor: OliveMarketEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveMarketService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.marketEditor);
  }

  getEditedItem(): any {
    const market = this.marketEditor.getEditedItem();

    this.cacheService.invalidateCaches(OliveCacheService.cacheKeys.getItemsKey.market);
    this.cacheService.invalidateCaches(OliveCacheService.cacheKeys.getItemsKey.marketSeller);

    return this.itemWithIdNAudit({
      code: market.code,
      name: market.name,
      phoneNumber: market.phoneNumber,
      email: market.email,
      webSite: market.webSite,
      memo: market.memo,
      internalTransaction: market.internalTransaction,
      activated: market.activated,
      marketExcelInterfaceId: market.marketExcelInterfaceId
    } as Market);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
