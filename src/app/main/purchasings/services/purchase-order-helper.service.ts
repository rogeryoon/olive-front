import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { String } from 'typescript-string-operations';

import { AlertService, MessageSeverity, DialogType } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { PurchaseOrder } from '../models/purchase-order.model';
import { OlivePurchasingMiscService } from './purchasing-misc.service';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveBackEndErrors, OliveBackEndErrorMessages } from 'app/core/classes/back-end-errors';
import { InWarehouseItem } from '../models/in-warehouse-item.model';

@Injectable({
  providedIn: 'root'
})
export class OlivePurchaseOrderHelperService {
  private subject = new Subject<any>();

  loadingIndicator: boolean;

  constructor
  (
    private miscService: OlivePurchasingMiscService, private translator: FuseTranslationLoaderService,
    private alertService: AlertService, private messageHelper: OliveMessageHelperService
  ) 
  {
  }

  getError(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Patches purchase order
   * @param order 
   * @param transactionType 
   */
  patchPurchaseOrder(order: PurchaseOrder, transactionType: string) {
    this.loadingIndicator = true;

     this.miscService.patchPurchaseOrder(transactionType, order.id).subscribe(
      response => {
        this.loadingIndicator = false;

        let message = '';

        if (transactionType === OliveConstants.listExtraCommand.close) {
          message = this.translator.get('purchasing.purchaseOrders.closed');
        }
        else if (transactionType === OliveConstants.listExtraCommand.open) {
          message = this.translator.get('purchasing.purchaseOrders.opened');
        }

        this.alertService.showMessage(
          this.translator.get('common.title.success'), 
          message, 
          MessageSeverity.success
        );

        if (transactionType === OliveConstants.listExtraCommand.print) {
          order.printOutCount = response.model.printOutCount;
          order.lastPrintOutUser = response.model.lastPrintOutUser;
        }
        else {
          order.closedDate = transactionType === OliveConstants.listExtraCommand.close ? response.model.closedDate : null;
        }
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showStickySaveFailed(error, false);
      }
    );
  }

  /**
   * 발주 종결/종결취소 처리
   * @param order 
   */
  finishPurchaseOrder(order: PurchaseOrder) {
    let errorDialogMessage: string;
    let errorDialogTitle: string;
    let transactionType: string;

    let startTabIndex = 0;

    if (order.closedDate) {
      transactionType = OliveConstants.listExtraCommand.open;
    }
    else { // 종결 요청 Validation
      if (order.purchaseOrderItems.length === 0) { // No Item?
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.noItem');
        startTabIndex = 1;
      }
      else if (order.purchaseOrderPayments.length === 0) { // No Payment?
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.noPayment');
        startTabIndex = 2;
      }
      else if (order.inWarehouseCompletedDate) { // 입고완료
        transactionType = OliveConstants.listExtraCommand.close;
      }
      else { // 입고중
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.pendingInWarehouse');
      }
    }

    if (transactionType) { // 저장 확인
      this.alertService.showDialog(
        this.translator.get('common.title.yesOrNo'),
        transactionType === OliveConstants.listExtraCommand.open ? 
          this.translator.get('purchasing.purchaseOrders.confirmOpen') : this.translator.get('purchasing.purchaseOrders.confirmClose'),
        DialogType.confirm,
        () => this.patchPurchaseOrder(order, transactionType),
        () => null,
        this.translator.get('common.button.save'),
        this.translator.get('common.button.cancel')
      );
    }
    else {
      this.alertService.showDialog
        (
          errorDialogTitle,
          errorDialogMessage,
          DialogType.alert,
          () => this.subject.next({order: order, startTabIndex: startTabIndex})
        );
    }
  }

  inWarehouseServerValidationErrorHandler(error: any, items: InWarehouseItem[]) {
    this.alertService.stopLoadingMessage();

    // 서버쪽 Validation Error 검출시
    // 이경우 User에게 알리고 다시 재입력하게 한다.
    if (error.error && error.error.errorCode === OliveBackEndErrors.ServerValidationError) {
      let errorMessage = this.translator.get('common.validate.serverValidationGeneralMessage');

      const errors = error.error.errorMessage.split(OliveConstants.constant.serverValidationDelimiter) as string[];
      const serverErrorType = errors[0];
      if (serverErrorType === OliveBackEndErrorMessages.NotRangeQuantity) {
        const inWarehouseItemId = Number(errors[1]);
        const minQuantity = Number(errors[2]);
        const maxQuantity = Number(errors[3]);

        const foundItem = items.find(x => x.id === inWarehouseItemId); 
        const itemName = foundItem ? foundItem.productName : this.translator.get('common.word.deletedRow');

        errorMessage = String.Format(this.translator.get('purchasing.inWarehouseManager.notRangeQuantity'), minQuantity, maxQuantity, itemName); 
      }

      this.alertService.showMessageBox(this.translator.get('common.title.saveError'), errorMessage);
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }
  }
}
