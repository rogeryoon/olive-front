import { Component, ViewChild } from '@angular/core';
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
import { OlivePurchaseOrderHelperService } from 'app/main/purchasings/services/purchase-order-helper.service';
import { InWarehouseItem } from 'app/main/purchasings/models/in-warehouse-item.model';

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
    dataService: OliveInWarehouseService, private purchaseOrderHelperService: OlivePurchaseOrderHelperService
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

  get inWarehouseItems(): InWarehouseItem[] {
    return this.inWarehouseItemsEditor.getEditedItem();
  }

  getEditedItem(): any {
    const inWarehouse = this.inWarehouseEditor.getEditedItem();

    return this.itemWithIdNAudit({
      itemCount: this.inWarehouseItemsEditor.totalQuantity,
      memo: inWarehouse.memo,
      warehouseId: inWarehouse.warehouseId,
      inWarehouseItems: this.inWarehouseItems
    } as InWarehouse);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      inWarehouseItems: null
    });
  }

  convertModel() {
    const inWarehouse = this.item as InWarehouse;

    for (const item of inWarehouse.inWarehouseItems) {
      item.balance = item.currentBalance;
      item.originalBalance = item.quantity + item.balance;
    }
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
    this.alertService.showMessageBox(
      this.translator.get('common.title.errorConfirm'),
      this.translator.get('purchasing.inWarehouseManager.noWarehouseSelected')
    );
  }

  onSaveFail(error: any) {
    this.purchaseOrderHelperService.inWarehouseServerValidationErrorHandler(error, this.inWarehouseItems);
    this.isSaving = false;
  }
}
