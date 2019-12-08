import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMarketSellerService } from '../../../services/market-seller.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveMarketSellerEditorComponent } from '../market-seller-editor/market-seller-editor.component';
import { MarketSeller } from '../../../models/market-seller.model';
import { OliveCacheService } from 'app/core/services/cache.service';

@Component({
  selector: 'olive-market-seller-manager',
  templateUrl: './market-seller-manager.component.html',
  styleUrls: ['./market-seller-manager.component.scss']
})
export class OliveMarketSellerManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveMarketSellerEditorComponent) 
  private marketSellerEditor: OliveMarketSellerEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveMarketSellerService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.marketSellerEditor);
  }

  getEditedItem(): any {
    const marketSeller = this.marketSellerEditor.getEditedItem();

    this.cacheService.invalidateCaches(OliveCacheService.cacheKeys.getItemsKey.marketSeller);

    return this.itemWithIdNAudit({
      code: marketSeller.code,
      name: marketSeller.name,
      memo: marketSeller.memo,
      activated: marketSeller.activated,
      marketId: marketSeller.marketId,
      companyId: marketSeller.companyId
    } as MarketSeller);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
