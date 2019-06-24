import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar, fadeInContent } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveOrderShipOutService } from '../../../services/order-ship-out.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveOrderShipOutEditorComponent } from '../order-ship-out-editor/order-ship-out-editor.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { OliveAddressEditorComponent } from 'app/core/components/entries/address-editor/address-editor.component';
import { OliveDeliveryTagEditorComponent } from 'app/core/components/entries/delivery-tag/delivery-tag-editor.component';
import { OliveOrderShipOutDetailsEditorComponent } from './order-ship-out-details-editor/order-ship-out-details-editor.component';
import { OliveConstants } from 'app/core/classes/constants';

@Component({
  selector: 'olive-order-ship-out-manager',
  templateUrl: './order-ship-out-manager.component.html',
  styleUrls: ['./order-ship-out-manager.component.scss']
})
export class OliveOrderShipOutManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveOrderShipOutEditorComponent)
  private orderShipOutEditor: OliveOrderShipOutEditorComponent;

  @ViewChild(OliveDeliveryTagEditorComponent)
  private deliveryTagEditor: OliveDeliveryTagEditorComponent;

  @ViewChild(OliveAddressEditorComponent)
  private deliveryAddressEditor: OliveAddressEditorComponent;

  @ViewChild(OliveOrderShipOutDetailsEditorComponent)
  private orderShipOutDetailsEditor: OliveOrderShipOutDetailsEditorComponent;

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
    this.subControls.push(this.deliveryTagEditor);
    this.subControls.push(this.deliveryAddressEditor);
    this.subControls.push(this.orderShipOutDetailsEditor);
  }

  getEditedItem(): any {
    return this.itemWithIdNAudit({
      deliveryTagFk: this.deliveryTagEditor.getEditedItem(),
      deliveryAddressFk: this.deliveryAddressEditor.getEditedItem(),
      orderFk: this.orderShipOutEditor.getEditedOrder(),
      orderShipOutDetails: this.orderShipOutDetailsEditor.items
    } as OrderShipOut);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      orderShipOutDetails: null
    });
  }

  resetForm() {
    this.oForm.reset({});

    if (this.item) {
      this.oForm.patchValue({
        orderShipOutDetails: this.item.orderShipOutDetails
      });
    }
  }

  public customButtonAction(buttonId: string): void {
    if (this.canCancelOrder(buttonId) || this.canRestoreOrder(buttonId)) {
      this.markOrderShipOut(buttonId);
    }
  }

  markOrderShipOut(buttonId: string): void {
    const dataService = this.dataService as OliveOrderShipOutService;

    this.alertService.showDialog(
      this.translater.get('common.title.yesOrNo'),
      this.translater.get('common.message.areYouSure'),
      DialogType.confirm,
      () =>
        buttonId === OliveConstants.customButton.cancelOrder ?
          dataService.cancelOrder(this.item.id).subscribe(
            response => this.onSaveSuccess(response.model),
            error => this.onSaveFail(error)
          ) :
          dataService.restoreOrder(this.item.id).subscribe(
            response => this.onSaveSuccess(response.model),
            error => this.onSaveFail(error)
          ),
      () => null,
      this.translater.get('common.button.yes'),
      this.translater.get('common.button.no')
    );
  }

  customButtonVisible(buttonId: string): boolean {
    if (this.canCancelOrder(buttonId)) {
      return true;
    }
    else if (this.canRestoreOrder(buttonId)) {
      return true;
    }
    return false;
  }

  canCancelOrder(buttonId: string): boolean {
    return this.item && buttonId === OliveConstants.customButton.cancelOrder &&
      !this.item.shipOutDate && !this.item.canceledDate;
  }

  canRestoreOrder(buttonId: string): boolean {
    return this.item && buttonId === OliveConstants.customButton.restoreOrder &&
      !this.item.shipOutDate && this.item.canceledDate;
  }
}
