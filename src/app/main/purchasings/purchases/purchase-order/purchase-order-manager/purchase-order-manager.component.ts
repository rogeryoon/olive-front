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
import { isSameNumber } from 'app/core/utils/number-helper';
import { OliveConstants } from 'app/core/classes/constants';

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

      this.setWarehouseDropDownLocked();    
    }

    this.purchaseOrderItems.setParentItem(this.item);
  }

  /**
   * Sets warehouse drop down locked
   * 발주 작성 수량과 현재 남은 잔량이 일치하지 않는건이 있을경우
   * 종속되는 입고 / 취소건이 있기때문에 창고는 더이상 변경할수 없다.
   */
  setWarehouseDropDownLocked()
  {
    if (this.isNewItem) {
      return;
    }

    const items = this.item.purchaseOrderItems as PurchaseOrderItem[];

    this.purchaseOrderEditor.warehouseLocked = items.some(x => x.quantity !== x.balance);
  }

  popUpConfirmSaveDialog() {
    const totalPaymentAmount = this.purchaseOrderPayments.items.filter(x => x.amount > 0).map(y => Number(y.amount)).reduce((a, b) => a + (b || 0), 0);

    const saveWithOutConfirm = isSameNumber(totalPaymentAmount, this.totalDueAmount);

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

      const errors = error.error.errorMessage.split(OliveConstants.constant.serverValidationDelimiter) as string[];
      const serverErrorType = errors[0];
      if (serverErrorType === OliveBackEndErrorMessages.NotMinimumQuantity) {
        const purchaseOrderItemId = Number(errors[1]);
        const minQuantity = Number(errors[2]);

        const items = this.purchaseOrderItems.getEditedItem().items as PurchaseOrderItem[];
        
        const foundItem = items.find(x => x.id === purchaseOrderItemId);

        const itemName = foundItem ? foundItem.productName : this.translator.get('common.word.deletedRow');

        errorMessage = String.Format(this.translator.get('purchasing.purchaseOrder.notMinimumQuantity'), minQuantity, itemName); 
      }
      else if (serverErrorType === OliveBackEndErrorMessages.NotMatchItem) {
        errorMessage = this.messageHelper.getProductNotMatchedErrorMessage(errors);
      }

      this.alertService.showMessageBox(this.translator.get('common.title.saveError'), errorMessage);
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }

    this.isSaving = false;
  }
}
