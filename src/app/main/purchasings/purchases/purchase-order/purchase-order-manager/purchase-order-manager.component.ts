import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OlivePurchaseOrderService } from '../../services/purchase-order.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/entity-edit/entity-edit.component';
import { OlivePurchaseOrderEditorComponent } from '../purchase-order-editor/purchase-order-editor.component';
import { OlivePurchaseOrderPaymentsEditorComponent } from '../purchase-order-payments-editor/purchase-order-payments-editor.component';
import { OlivePurchaseOrderItemsEditorComponent } from '../purchase-order-items-editor/purchase-order-items-editor.component';

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
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OlivePurchaseOrderService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.purchaseOrderEditor);
    this.subControls.push(this.purchaseOrderPayments);
    this.subControls.push(this.purchaseOrderItems);
  }

  test() {
    this.item.id = 3;
  }

  onCurrencyChanged(id) {
    this.purchaseOrderItems.onCurrencyChanged(id);
  }

  onCurrencyExchangeRateChanged(exchangeRate) {
    this.purchaseOrderItems.onCurrencyExchangeRateChanged(exchangeRate);
  }

  getEditedItem(): any {
    const purchaseOrder = this.purchaseOrderEditor.getEditedItem();

    return this.itemWithIdNAudit({
      vendorOrderId: purchaseOrder.vendorOrderId,
      date: purchaseOrder.date,
      memo: purchaseOrder.memo,
      totalItemsAmount: this.purchaseOrderItems.totalAmount,
      addedDiscountAmount: purchaseOrder.addedDiscountAmount,
      freightAmount: purchaseOrder.freightAmount,
      taxAmount: purchaseOrder.taxAmount,
      totalDueAmount: (
        this.purchaseOrderItems.totalAmount + purchaseOrder.freightAmount 
        + purchaseOrder.taxAmount - purchaseOrder.addedDiscountAmount),
      currencyExchangeRate: purchaseOrder.currencyExchangeRate,
      closedDate: purchaseOrder.closedDate,
      printOutCount: purchaseOrder.printOutCount,
      lastPrintOutUser: purchaseOrder.lastPrintOutUser,
      vendorId: purchaseOrder.vendorId,
      warehouseId: purchaseOrder.warehouseId,
      currencyId: purchaseOrder.currencyId,
      purchaseOrderPayments: this.purchaseOrderPayments.items,
      purchaseOrderItems: this.purchaseOrderItems.items
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
  }
}
