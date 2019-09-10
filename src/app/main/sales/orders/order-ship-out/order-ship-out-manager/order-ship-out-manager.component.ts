import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import * as _ from 'lodash';

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
import { OliveOrderShipOutTrackingEditorComponent } from '../order-ship-out-tracking-editor/order-ship-out-tracking-editor.component';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveOrderShipOutSplitterManagerComponent } from './order-ship-out-splitter-manager/order-ship-out-splitter-manager.component';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';

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

  @ViewChild(OliveOrderShipOutTrackingEditorComponent)
  private trackingEditor: OliveOrderShipOutTrackingEditorComponent;  

  @ViewChild(OliveAddressEditorComponent)
  private deliveryAddressEditor: OliveAddressEditorComponent;

  @ViewChild(OliveOrderShipOutDetailsEditorComponent)
  private orderShipOutDetailsEditor: OliveOrderShipOutDetailsEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveOrderShipOutService, private dialog: MatDialog
  ) {
    super(
      translator, alertService,
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
    this.subControls.push(this.trackingEditor);
  }

  getEditedItem(): OrderShipOut {
    const order = this.itemWithIdNAudit({
      deliveryTagFk: this.deliveryTagEditor.getEditedItem(),
      deliveryAddressFk: this.deliveryAddressEditor.getEditedItem(),
      orderFk: this.orderShipOutEditor.getEditedOrder(),
      orderShipOutDetails: this.orderShipOutDetailsEditor.items
    });

    const tracking = this.trackingEditor.getEditedItem();

    order.trackingNumber = tracking.trackingNumber;
    order.carrierId = tracking.carrierId;
    order.oldTrackingNumber = tracking.oldTrackingNumber;
    order.carrierBranchId = tracking.carrierBranchId;

    return order;
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
        orderShipOutDetails: this.item
      });
    }
  }

  public customButtonAction(buttonId: string): void {
    if (this.canCancelOrder(buttonId) || this.canRestoreOrder(buttonId)) {
      this.confirmCancelOrRestoreOrder(buttonId);
      return;
    }

    if (this.canSplitOrder(buttonId)) {
      this.showSplitOrderDialog();
      return;      
    }
  }

  showSplitOrderDialog(): void {
    const order = this.item as OrderShipOut;

    const setting = new OliveDialogSetting(
      OliveOrderShipOutSplitterManagerComponent,
      {
        item: _.cloneDeep(order),
        itemType: OrderShipOut,
        customTitle: `${order.orderFk.marketSellerFk.code} - ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(items => {
      if (items) {
        this.onSaveSuccess(items);
      }
    });    
  }

  getOrderCount(order: OrderShipOut): string {
    return this.commaNumber(order.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + b));
  }

  /**
   * Confirms cancel or restore order
   * @param buttonId 
   */
  confirmCancelOrRestoreOrder(buttonId: string): void {
    const dataService = this.dataService as OliveOrderShipOutService;

    this.alertService.showDialog(
      this.translator.get('common.title.yesOrNo'),
      this.translator.get('common.message.areYouSure'),
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
      this.translator.get('common.button.yes'),
      this.translator.get('common.button.no')
    );
  }

  /**
   * Customs button visible
   * @param buttonId 
   * @returns true if button visible 
   */
  customButtonVisible(buttonId: string): boolean {
    if (this.canCancelOrder(buttonId)) {
      return true;
    }
    else if (this.canRestoreOrder(buttonId)) {
      return true;
    }
    else if (this.canSplitOrder(buttonId)) {
      return true;
    }

    return false;
  }

  /**
   * Determines whether cancel order can
   * @param buttonId 
   * @returns true if cancel order 
   */
  canCancelOrder(buttonId: string): boolean {
    return this.item && buttonId === OliveConstants.customButton.cancelOrder &&
      !this.item.shipOutDate && !this.item.canceledDate;
  }

  /**
   * Determines whether restore order can
   * @param buttonId 
   * @returns true if restore order 
   */
  canRestoreOrder(buttonId: string): boolean {
    return this.item && buttonId === OliveConstants.customButton.restoreOrder &&
      !this.item.shipOutDate && this.item.canceledDate;
  }

  /**
   * Determines whether split order can
   * @param buttonId 
   * @returns true if split order 
   */
  canSplitOrder(buttonId: string): boolean {
    const order = this.item as OrderShipOut;
    return order && buttonId === OliveConstants.customButton.splitOrder;
  }

  get trackingReadOnly(): boolean {
    return this.item.id && (this.item.shipOutDate || this.item.canceledDate);
  }

  onSaveFail(error: any) {
    this.alertService.stopLoadingMessage();

    // 저장시 백앤드에서 다른 송장번호 범위와 중첩되는지 검사 오류 반환
    // 이경우 User에게 알리고 다시 재입력하게 한다.
    if (error.error && error.error.errorCode === OliveBackEndErrors.ServerValidationError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.saveError'),
        this.translator.get('common.validate.trackingNumberInvalid')
      );
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }

    this.isSaving = false;
  }
}
