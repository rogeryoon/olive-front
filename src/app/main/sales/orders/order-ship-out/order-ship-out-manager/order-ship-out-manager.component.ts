import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveOrderShipOutService } from '../../../services/order-ship-out.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveOrderShipOutEditorComponent } from '../order-ship-out-editor/order-ship-out-editor.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';

@Component({
  selector: 'olive-order-ship-out-manager',
  templateUrl: './order-ship-out-manager.component.html',
  styleUrls: ['./order-ship-out-manager.component.scss']
})
export class OliveOrderShipOutManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveOrderShipOutEditorComponent) 
  private orderShipOutEditor: OliveOrderShipOutEditorComponent;

  // @ViewChild(OliveDeliveryTagFkEditorComponent)
  // private deliveryTagFkEditor: OliveDeliveryTagFkEditorComponent;
  // @ViewChild(OliveDeliveryAddressFkEditorComponent)
  // private deliveryAddressFkEditor: OliveDeliveryAddressFkEditorComponent;
  // @ViewChild(OliveOrderFkEditorComponent)
  // private orderFkEditor: OliveOrderFkEditorComponent;
  // @ViewChild(OliveOrderShipOutDetailsEditorComponent)
  // private orderShipOutDetailsEditor: OliveOrderShipOutDetailsEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveOrderShipOutService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.orderShipOutEditor);
    // this.subControls.push(this.deliveryTagFkEditor);
    // this.subControls.push(this.deliveryAddressFkEditor);
    // this.subControls.push(this.orderFkEditor);
    // this.subControls.push(this.orderShipOutDetailsEditor);
  }

  getEditedItem(): any {
    const orderShipOut = this.orderShipOutEditor.getEditedItem();
    // const deliveryTagFk = this.deliveryTagFkEditor.getEditedItem();
    // const deliveryAddressFk = this.deliveryAddressFkEditor.getEditedItem();
    // const orderFk = this.orderFkEditor.getEditedItem();
    // const orderShipOutDetails = this.orderShipOutDetailsEditor.getEditedItem();

    return this.itemWithIdNAudit({
      shipOutDate: orderShipOut.shipOutDate,
      canceledDate: orderShipOut.canceledDate,
      canceledUser: orderShipOut.canceledUser,
      // deliveryTagFk: deliveryTagFk.deliveryTagFk,
      // deliveryAddressFk: deliveryAddressFk.deliveryAddressFk,
      // orderFk: orderFk.orderFk,
      // orderShipOutDetails: orderShipOutDetails.orderShipOutDetails
    } as OrderShipOut);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
