import { Component, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OrderShipOut } from 'app/main/sales/models/order-ship-out.model';
import { OliveOrderShipOutService } from 'app/main/sales/services/order-ship-out.service';
import { OliveOrderShipOutDetailsEditorComponent } from '../order-ship-out-details-editor/order-ship-out-details-editor.component';
import { OrderShipOutDetail } from 'app/main/sales/models/order-ship-out-detail.model';

@Component({
  selector: 'olive-order-ship-out-splitter.manager',
  templateUrl: './order-ship-out-splitter-manager.component.html',
  styleUrls: ['./order-ship-out-splitter-manager.component.scss']
})
export class OliveOrderShipOutSplitterManagerComponent extends OliveEntityEditComponent {
  orders: OrderShipOut[] = [];
  maxOrderCount: number[];

  @ViewChildren(OliveOrderShipOutDetailsEditorComponent) orderItemsControls: QueryList<OliveOrderShipOutDetailsEditorComponent>;
  
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveOrderShipOutService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );

    this.saveConfirmTitle = translator.get('common.title.saveConfirmTitle');
    this.enableSaveButton = true;
  }

  getEditedItem(): OrderShipOutDetail[][] {
    const orderItemsGroups: OrderShipOutDetail[][] = [];

    this.orderItemsControls.forEach((control: OliveOrderShipOutDetailsEditorComponent) => {
      orderItemsGroups.push(control.items);
    });

    return orderItemsGroups;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({
      orderCount: '',
      formArray: this.oFormArray
    });
  }

  resetForm() {
    this.orders = this.deepCopyOrders(2);
    this.maxOrderCount = [2, 3, 4, 5];

    this.oForm.reset({
      orderCount: 2,
      formArray: []
    });

    this.oForm.patchValue({
      formArray: this.buildOrderItemsControls()
    });
  }

  buildOrderItemsControls(): FormGroup[] {
    this.oFormArray.controls = [];

    const formGroups: FormGroup[] = [];

    for (const order of this.orders) {
      this.oFArray.push(this.formBuilder.group({
        orderItems : order
      }));
    }

    return formGroups;
  }

  onOrderCountChange(count: number) {
    this.orders = this.deepCopyOrders(count);
    this.oForm.patchValue({
      formArray: this.buildOrderItemsControls()
    });    
  }

  deepCopyOrders(count): OrderShipOut[] {
    this.orders = [];

    for (let index = 0; index < count; index++) {
      this.orders.push(_.cloneDeep(this.item));
    }
    return this.orders;
  }

  sendToEndPoint(orderItemsGroups: OrderShipOutDetail[][]) {
    this.isSaving = false;

    const dataService = this.dataService as OliveOrderShipOutService;

    dataService.splitOrder(this.item.id, orderItemsGroups).subscribe(
      response => this.onSaveSuccess(response.model, false),
      error => this.onSaveFail(error)
    );
  }

  popUpConfirmSaveDialog() {
    const originalOrderTotalQuantity = this.item.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + b);

    const orderItemsGroups = this.getEditedItem();

    let editedTotalQuantity = 0;
    for (const group of orderItemsGroups) {
      editedTotalQuantity += +group.map(x => x.quantity).reduce((a, b) => +a + +b);
    }

    if (originalOrderTotalQuantity === editedTotalQuantity) {
      this.saveConfirmMessage = this.translator.get('sales.orderShipOutSplitterManager.saveConfirmMessage');
    }
    else {
      this.saveConfirmMessage = this.translator.get('sales.orderShipOutSplitterManager.saveUnmatchedConfirmMessage');      
    }

    super.popUpConfirmSaveDialog();    
  }
}
