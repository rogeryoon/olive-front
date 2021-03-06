﻿import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMarketExcelRowService } from '../../../services/market-excel-row.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { MarketExcelRow } from '../../../models/market-excel-row.model';

@Component({
  selector: 'olive-market-excel-row-manager',
  templateUrl: './market-excel-row-manager.component.html',
  styleUrls: ['./market-excel-row-manager.component.scss']
})
export class OliveMarketExcelRowManagerComponent extends OliveEntityEditComponent {
  rows: any[] = [];

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveMarketExcelRowService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );

  }

  initializeChildComponent() { 
  }

  resetForm() {
    const obj = JSON.parse((this.item as MarketExcelRow).data);

    Object.keys(obj).forEach(key => {
      const keyString = key.length === 1 ? '0' + key : key;
      this.rows.push({id: keyString, value: obj[key]});
    });
  }
}
