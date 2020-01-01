import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OlivePurchaseOrderEditorComponent } from '../purchase-order-editor/purchase-order-editor.component';
import { OlivePurchaseOrderPaymentsEditorComponent } from '../purchase-order-payments-editor/purchase-order-payments-editor.component';
import { OlivePurchaseOrderItemsEditorComponent } from '../purchase-order-items-editor/purchase-order-items-editor.component';
import { OliveBackEndErrors, OliveBackEndErrorMessages } from 'app/core/classes/back-end-errors';
import { PurchaseOrderItem } from 'app/main/purchasings/models/purchase-order-item.model';

@Component({
  selector: 'olive-purchase-order-manager',
  templateUrl: './purchase-order-manager.component.html',
  styleUrls: ['./purchase-order-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OlivePurchaseOrderManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OlivePurchaseOrderEditorComponent) 
  private purchaseOrderEditor: OlivePurchaseOrderEditorComponent;

  @ViewChild(OlivePurchaseOrderPaymentsEditorComponent)
  purchaseOrderPayments: OlivePurchaseOrderPaymentsEditorComponent;

  @ViewChild(OlivePurchaseOrderItemsEditorComponent)
  purchaseOrderItems: OlivePurchaseOrderItemsEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OlivePurchaseOrderService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );

    this.saveConfirmTitle = translator.get('common.title.saveErrorConfirmTitle');
  }

  registerSubControl() {
    this.subControls.push(this.purchaseOrderEditor);
    this.subControls.push(this.purchaseOrderPayments);
    this.subControls.push(this.purchaseOrderItems);
  }

  onCurrencyChanged(id) {
    this.purchaseOrderItems.onCurrencyChanged(id);
  }

  onCurrencyExchangeRateChanged(exchangeRate) {
    this.purchaseOrderItems.onCurrencyExchangeRateChanged(exchangeRate);
  }

  onPaymentAmountChanged(amount) {
    this.purchaseOrderPayments.onTotalItemEntryAmountChanged(amount);
  }

  get totalDueAmount(): number {
    const itemsEditor = this.purchaseOrderItems.getEditedItem();

    return Number(this.purchaseOrderItems.totalAmount) + Number(itemsEditor.freightAmount) + 
    Number(itemsEditor.taxAmount) - Number(itemsEditor.addedDiscountAmount);
  }

  getEditedItem(): any {
    const purchaseOrder = this.purchaseOrderEditor.getEditedItem();
    const itemsEditor = this.purchaseOrderItems.getEditedItem();

    return this.itemWithIdNAudit({
      supplierOrderId: purchaseOrder.supplierOrderId,
      date: purchaseOrder.date,
      shortId: purchaseOrder.shortId,
      memo: purchaseOrder.memo,
      totalAmount: this.purchaseOrderItems.totalAmount,
      addedDiscountAmount: itemsEditor.addedDiscountAmount,
      freightAmount: itemsEditor.freightAmount,
      taxAmount: itemsEditor.taxAmount,
      totalDueAmount: this.totalDueAmount,
      currencyExchangeRate: purchaseOrder.currencyExchangeRate,
      closedDate: purchaseOrder.closedDate,
      printOutCount: purchaseOrder.printOutCount,
      lastPrintOutUser: purchaseOrder.lastPrintOutUser,
      supplierId: purchaseOrder.supplierId,
      warehouseId: purchaseOrder.warehouseId,
      currencyId: purchaseOrder.currencyId,
      purchaseOrderPayments: this.purchaseOrderPayments.items.filter(x => x.amount > 0),
      purchaseOrderItems: itemsEditor.items
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      purchaseOrderPayments: null,
      purchaseOrderItems: null
    });
  }

  resetForm() {
    this.oForm.reset({
    });

    if (this.item) {
      this.oForm.patchValue({
        purchaseOrderPayments: this.item.purchaseOrderPayments,
        purchaseOrderItems: this.item.purchaseOrderItems
      });
    }

    this.purchaseOrderItems.setParentItem(this.item);
  }

  popUpConfirmSaveDialog() {
    const totalPaymentAmount = this.purchaseOrderPayments.items.filter(x => x.amount > 0).map(y => Number(y.amount)).reduce((a, b) => a + (b || 0), 0);

    const saveWithOutConfirm = totalPaymentAmount === this.totalDueAmount;

    // 금액이 맞지 않는 오류가 있을 경우 최종 확인
    if (!saveWithOutConfirm) {
      this.saveConfirmMessage = this.translator.get('purchasing.purchaseOrder.saveUnmatchedAmountConfirmMessage');
    }

    super.popUpConfirmSaveDialog(saveWithOutConfirm);    
  }

  onSaveFail(error: any) {
    this.alertService.stopLoadingMessage();

    // 서버쪽 Validation Error 검출시
    // 이경우 User에게 알리고 다시 재입력하게 한다.
    if (error.error && error.error.errorCode === OliveBackEndErrors.ServerValidationError) {
      let errorMessage = this.translator.get('common.validate.serverValidationGeneralMessage');

      const values = error.error.errorMessage.split(',');
      if (values[0] === OliveBackEndErrorMessages.NotMinimumQuantity) {
        const purchaseOrderItemId = Number(values[1]);
        const minimumQuantity = Number(values[2]);

        const items = this.purchaseOrderItems.getEditedItem().items as PurchaseOrderItem[];
        const itemName = items.find(x => x.id === purchaseOrderItemId);

        errorMessage = String.Format(this.translator.get('purchasing.purchaseOrder.notMinimumQuantity'), minimumQuantity, itemName) 
      }

      this.alertService.showMessageBox(this.translator.get('common.title.saveError'), errorMessage);
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }

    this.isSaving = false;
  }
}
