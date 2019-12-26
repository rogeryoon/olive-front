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
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveVoidPurchaseOrderService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );

    this.saveConfirmTitle = translator.get('purchasing.voidPurchaseOrderManager.saveConfirmTitle');
    this.saveConfirmMessage = translator.get('purchasing.voidPurchaseOrderManager.saveConfirmMessage');
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

    // 저장전에 Minus값으로 다시 복구한다.
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
      voidTypeCode: voidPurchaseOrder.voidTypeCode,
      purchaseOrderFk: voidPurchaseOrder.purchaseOrderFk,
      inWarehouseFk: voidPurchaseOrder.inWarehouseFk
    } as VoidPurchaseOrder);
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

  /**
   * 입고 아이템 음수 수량을 양수로 변경
   * @returns InWarehouseItems
   */
  changeInWarehouseItemsSignWhenLoading(): InWarehouseItem[] {
    const order = this.item as VoidPurchaseOrder;

    if 
    (
      !order.inWarehouseFk || 
      !order.inWarehouseFk.inWarehouseItems || 
      order.inWarehouseFk.inWarehouseItems.length === 0
    ) { return null; }

    const items = order.inWarehouseFk.inWarehouseItems;

    items.forEach(item => {
      item.quantity = item.quantity * -1;
    });

    return items;
  }

  /**
   * 결제 아이템 음수 금액을 양수로 변경
   * @returns PurchaseOrderPayments
   */
  changePaymentsSignWhenLoading(): PurchaseOrderPayment[] {
    const order = this.item as VoidPurchaseOrder;

    if 
    (
      !order.purchaseOrderFk || 
      !order.purchaseOrderFk.purchaseOrderPayments ||
      order.purchaseOrderFk.purchaseOrderPayments.length === 0
    ) { return null; }

    const items = order.purchaseOrderFk.purchaseOrderPayments;

    items.forEach(item => {
      item.amount = item.amount * -1;
    });

    return items;
  }

  onWarehouseChanged(event: any) {
    this.inWarehouseItemsEditor.setWarehouse(event);
    this.purchaseOrderPaymentsEditor.clearAll();

    if (!event.loading) {
      this.setOrderData(null);
    }
  }

  onRequiredWarehouse() {
    this.alertService.showMessageBox(
      this.translator.get('common.title.errorConfirm'),
      this.translator.get('purchasing.inWarehouseManager.mustSelectWarehouseAndVoidPurchaseOrderType')
    );
  }

  onInWarehouseItemAdded(order: PurchaseOrder) {
    this.setOrderData(order);
  }

  setOrderData(order: PurchaseOrder) {
    this.voidPurchaseOrderEditor.item.purchaseOrderFk = order;
    this.voidPurchaseOrderEditor.oForm.patchValue({
      purchaseOrderFk: order,
      supplierName: order ? order.supplierFk.name : null,
      memo: ''
    });
    
    this.oForm.patchValue({purchaseOrderPayments : order ? this.calculateByPaymentMethod(order) : null});
  }

  // 결제수단 별로 결제와 환불을 계산해서 결제수단별로 정리해서 반환
  // 합산값이 0이하 인경우 환불가능한 금액이 없으므로 삭제한다.
  calculateByPaymentMethod(order: PurchaseOrder): PurchaseOrderPayment[] {
    const payments = _.cloneDeep(order.purchaseOrderPayments);

    const balanceByPaymentMethod = new Map<number, number>();
    const keysForUniqueOrPlusValueCheck = new Set();

    payments.forEach(payment => {
      if (!balanceByPaymentMethod.has(payment.paymentMethodId)) {
        balanceByPaymentMethod.set(payment.paymentMethodId, payment.amount);
      }
      else {
        balanceByPaymentMethod.set(payment.paymentMethodId, balanceByPaymentMethod.get(payment.paymentMethodId) + payment.amount);
      }
    });

    payments.forEach(payment => {
      if (balanceByPaymentMethod.get(payment.paymentMethodId) <= 0) {
        keysForUniqueOrPlusValueCheck.add(payment.paymentMethodId);
      }
    });

    const finalPayments: PurchaseOrderPayment[] = [];

    payments.forEach(payment => {
      if (!keysForUniqueOrPlusValueCheck.has(payment.paymentMethodId)) {
        payment.id = null;
        payment.amount = balanceByPaymentMethod.get(payment.paymentMethodId);
        payment.remarkId = null;
        finalPayments.push(payment);
        keysForUniqueOrPlusValueCheck.add(payment.paymentMethodId);
      }
    });

    return finalPayments;
  }
}
