import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveVoidPurchaseOrderEditorComponent } from '../void-purchase-order-editor/void-purchase-order-editor.component';
import { OliveInWarehouseItemsEditorComponent } from 'app/main/purchasings/in-warehouses/in-warehouse/in-warehouse-items-editor/in-warehouse-items-editor.component';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { VoidPurchaseOrder } from '../../../models/void-purchase-order.model';
import { OlivePurchaseOrderPaymentsEditorComponent } from '../../purchase-order/purchase-order-payments-editor/purchase-order-payments-editor.component';
import { InWarehouseItem } from 'app/main/purchasings/models/in-warehouse-item.model';
import { PurchaseOrderPayment } from '../../../models/purchase-order-payment.model';
import { OliveVoidPurchaseOrderService } from '../../../services/void-purchase-order.service';

@Component({
  selector: 'olive-void-purchase-order-manager',
  templateUrl: './void-purchase-order-manager.component.html',
  styleUrls: ['./void-purchase-order-manager.component.scss']
})
export class OliveVoidPurchaseOrderManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveVoidPurchaseOrderEditorComponent) 
  private voidPurchaseOrderEditor: OliveVoidPurchaseOrderEditorComponent;

  @ViewChild(OliveInWarehouseItemsEditorComponent)
  private inWarehouseItemsEditor: OliveInWarehouseItemsEditorComponent;

  @ViewChild(OlivePurchaseOrderPaymentsEditorComponent)
  purchaseOrderPaymentsEditor: OlivePurchaseOrderPaymentsEditorComponent;
  
  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveVoidPurchaseOrderService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );

    this.saveConfirmTitle = translater.get('purchasing.voidPurchaseOrderManager.saveConfirmTitle');
    this.saveConfirmMessage = translater.get('purchasing.voidPurchaseOrderManager.saveConfirmMessage');
  }

  registerSubControl() {
    this.subControls.push(this.voidPurchaseOrderEditor);
    this.subControls.push(this.inWarehouseItemsEditor);
    this.subControls.push(this.purchaseOrderPaymentsEditor);
  }

  getEditedItem(): VoidPurchaseOrder {
    const voidPurchaseOrder = this.voidPurchaseOrderEditor.getEditedItem();
    const inWarehouseItems = _.cloneDeep(this.inWarehouseItemsEditor.getEditedItem());
    const purchaseOrderPayments = _.cloneDeep(this.purchaseOrderPaymentsEditor.items);

    // 저장전에 Minus값으로 전환한다.
    inWarehouseItems.forEach(item => {
      item.quantity = item.quantity * -1;
    });

    purchaseOrderPayments.forEach(payment => {
      payment.amount = payment.amount * -1;
    });
    
    voidPurchaseOrder.inWarehouseFk.itemCount = this.inWarehouseItemsEditor.totalQuantity * -1;
    voidPurchaseOrder.inWarehouseFk.inWarehouseItems = inWarehouseItems;
    voidPurchaseOrder.purchaseOrderFk.purchaseOrderPayments = purchaseOrderPayments;

    return this.itemWithIdNAudit({
      closedDate: this.item.closedDate,
      confirmedDate: this.item.confirmedDate,
      purchaseOrderFk: voidPurchaseOrder.purchaseOrderFk,
      inWarehouseFk: voidPurchaseOrder.inWarehouseFk
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      inWarehouseItems: null,
      purchaseOrderPayments: null
    });
  }

  resetForm() {
    this.oForm.reset({});

    if (this.item) {
      this.oForm.patchValue({
        inWarehouseItems: this.changeInWarehouseItemsSignWhenLoading(),
        purchaseOrderPayments: this.changePaymentsSignWhenLoading()
      });
    }
  }

  changeInWarehouseItemsSignWhenLoading(): InWarehouseItem[] {
    if (!this.item.inWarehouseItems) { return null; }

    const items = this.item.inWarehouseItems as InWarehouseItem[];

    items.forEach(item => {
      item.quantity = item.quantity * -1;
    });

    return items;
  }

  changePaymentsSignWhenLoading(): PurchaseOrderPayment[] {
    if (!this.item.purchaseOrderFk || !this.item.purchaseOrderFk.purchaseOrderPayments) { return null; }

    const items = this.item.purchaseOrderFk.purchaseOrderPayments as PurchaseOrderPayment[];

    items.forEach(item => {
      item.amount = item.amount * -1;
    });

    return items;
  }

  onWarehouseChanged(event: any) {
    this.inWarehouseItemsEditor.setWarehouse(event);

    if (!event.loading) {
      this.setOrderData(null);
    }
  }

  onRequiredWarehouse() {
    this.voidPurchaseOrderEditor.lookUp();
  }

  onInWarehouseItemAdded(order: PurchaseOrder) {
    this.setOrderData(order);
  }

  setOrderData(order: PurchaseOrder) {
    this.voidPurchaseOrderEditor.setControlValue('purchaseOrderFk', order);
    this.voidPurchaseOrderEditor.setControlValue('supplierName', order ? order.supplierFk.name : null);
    this.voidPurchaseOrderEditor.item.purchaseOrderFk = order;
    this.oForm.patchValue({purchaseOrderPayments : order ? this.calculateByPaymentMethod(order) : null});
  }

  // 결제수단 별로 결제와 환불을 계산해서 결제수단별로 정리해서 반환
  // 합산값이 0이하 인경우 환불가능한 금액이 없으므로 삭제한다.
  calculateByPaymentMethod(order: PurchaseOrder): PurchaseOrderPayment[] {
    const payments = _.cloneDeep(order.purchaseOrderPayments);

    const balanceByPamentMethod = new Map<number, number>();
    const keysForUniqueOrPlusValueCheck = new Set();

    payments.forEach(payment => {
      if (!balanceByPamentMethod.has(payment.paymentMethodId)) {
        balanceByPamentMethod.set(payment.paymentMethodId, payment.amount);
      }
      else {
        balanceByPamentMethod.set(payment.paymentMethodId, balanceByPamentMethod.get(payment.paymentMethodId) + payment.amount);
      }
    });

    payments.forEach(payment => {
      if (balanceByPamentMethod.get(payment.paymentMethodId) <= 0) {
        keysForUniqueOrPlusValueCheck.add(payment.paymentMethodId);
      }
    });

    const finalPayments: PurchaseOrderPayment[] = [];

    payments.forEach(payment => {
      if (!keysForUniqueOrPlusValueCheck.has(payment.paymentMethodId)) {
        payment.id = null;
        payment.amount = balanceByPamentMethod.get(payment.paymentMethodId);
        payment.remarkId = null;
        finalPayments.push(payment);
        keysForUniqueOrPlusValueCheck.add(payment.paymentMethodId);
      }
    });

    return finalPayments;
  }
}
