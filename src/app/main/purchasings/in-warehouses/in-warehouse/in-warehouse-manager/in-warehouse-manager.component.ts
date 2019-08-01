﻿import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveInWarehouseService } from '../../../services/in-warehouse.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveInWarehouseEditorComponent } from '../in-warehouse-editor/in-warehouse-editor.component';
import { OliveInWarehouseItemsEditorComponent } from '../in-warehouse-items-editor/in-warehouse-items-editor.component';
import { InWarehouse } from '../../../models/in-warehouse.model';

@Component({
  selector: 'olive-in-warehouse-manager',
  templateUrl: './in-warehouse-manager.component.html',
  styleUrls: ['./in-warehouse-manager.component.scss']
})
export class OliveInWarehouseManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveInWarehouseEditorComponent) 
  private inWarehouseEditor: OliveInWarehouseEditorComponent;

  @ViewChild(OliveInWarehouseItemsEditorComponent)
  private inWarehouseItemsEditor: OliveInWarehouseItemsEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveInWarehouseService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );

    this.saveConfirmTitle = translator.get('purchasing.inWarehouseManager.saveConfirmTitle');
    this.saveConfirmMessage = translator.get('purchasing.inWarehouseManager.saveConfirmMessage');
  }

  registerSubControl() {
    this.subControls.push(this.inWarehouseEditor);
    this.subControls.push(this.inWarehouseItemsEditor);
  }

  getEditedItem(): any {
    const inWarehouse = this.inWarehouseEditor.getEditedItem();
    const inWarehouseItems = this.inWarehouseItemsEditor.getEditedItem();

    return this.itemWithIdNAudit({
      itemCount: this.inWarehouseItemsEditor.totalQuantity,
      memo: inWarehouse.memo,
      warehouseId: inWarehouse.warehouseId,
      inWarehouseItems: inWarehouseItems
    } as InWarehouse);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      inWarehouseItems: null
    });
  }

  resetForm() {
    this.oForm.reset({});

    if (this.item) {
      this.oForm.patchValue({
        inWarehouseItems: this.item.inWarehouseItems
      });
    }
  }

  onWarehouseChanged(event: any) {
    this.inWarehouseItemsEditor.setWarehouse(event);
  }

  onRequiredWarehouse() {
    this.inWarehouseEditor.lookUp();
  }
}
