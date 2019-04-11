import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveVoidPurchaseOrderEditorComponent } from '../void-purchase-order-editor/void-purchase-order-editor.component';
import { OliveVoidPurchaseOrderItemsEditorComponent } from '../void-purchase-order-items-editor/void-purchase-order-items-editor.component';
import { OliveInWarehouseService } from 'app/main/purchasings/in-warehouses/services/in-warehouse.service';

@Component({
  selector: 'olive-void-purchase-order-manager',
  templateUrl: './void-purchase-order-manager.component.html',
  styleUrls: ['./void-purchase-order-manager.component.scss']
})
export class OliveVoidPurchaseOrderManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveVoidPurchaseOrderEditorComponent) 
  private voidPurchaseOrderEditor: OliveVoidPurchaseOrderEditorComponent;

  @ViewChild(OliveVoidPurchaseOrderItemsEditorComponent)
  private voidPurchaseOrderItemsEditor: OliveVoidPurchaseOrderItemsEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveInWarehouseService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );

    this.saveConfirmTitle = translater.get('common.title.inWarehouseConfirm');
    this.saveConfirmMessage = translater.get('common.message.inWarehouseConfirm');
  }

  registerSubControl() {
    this.subControls.push(this.voidPurchaseOrderEditor);
    this.subControls.push(this.voidPurchaseOrderItemsEditor);
  }

  getEditedItem(): any {
    const inWarehouse = this.voidPurchaseOrderEditor.getEditedItem();
    const inWarehouseItems = this.voidPurchaseOrderItemsEditor.getEditedItem();

    return this.itemWithIdNAudit({
      itemCount: this.voidPurchaseOrderItemsEditor.totalQuantity,
      memo: inWarehouse.memo,
      warehouseId: inWarehouse.warehouseId,
      inWarehouseItems: inWarehouseItems.inWarehouseItems
    });
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

    this.voidPurchaseOrderItemsEditor.setParentItem(this.item);
  }

  onWarehouseChanged(item: any) {
    this.voidPurchaseOrderItemsEditor.setWarehouse(item);
  }
}
