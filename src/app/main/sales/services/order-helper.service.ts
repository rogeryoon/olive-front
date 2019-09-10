import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { IdName } from 'app/core/models/id-name';
import { CarrierTrackingNumbersGroup } from 'app/main/shippings/models/carrier-tracking-numbers-group.model';
import { OliveSelectOneDialogComponent } from 'app/core/components/dialogs/select-one-dialog/select-one-dialog.component';
import { OliveSelectOneSetting } from 'app/core/interfaces/dialog-setting/select-one-setting';
import { OrderShipOut } from '../models/order-ship-out.model';
import { OrderShipOutDetail } from '../models/order-ship-out-detail.model';
import { OliveConstants } from 'app/core/classes/constants';
import { numberFormat } from 'app/core/utils/number-helper';
import { OrderShipOutTrackingNumberIssue } from 'app/main/shippings/models/order-ship-out-tracking-number-issue.model';
import { OliveCarrierTrackingNumberRangeService } from 'app/main/shippings/services/carrier-tracking-number-range.service';
import { CarrierTrackingIssueDto } from 'app/main/shippings/models/carrier-tracking-issue.model';
import { AlertService, DialogType } from '@quick/services/alert.service';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OliveOrderHelperService {
  trackingAssignTrigger = new Subject<any>();

  constructor
  (
    private translator: FuseTranslationLoaderService, private dialog: MatDialog,
    private alertService: AlertService, private messageHelper: OliveMessageHelperService,
    private carrierTrackingNumberRangeService: OliveCarrierTrackingNumberRangeService,
    private router: Router,
  ) 
  {
  }

  /**
   * 선송장번호를 발급
   * @param carrierTrackingsNumbersGroup 
   * @param targetOrders 
   */
  preAssignTrackingNumbers(carrierTrackingsNumbersGroup: CarrierTrackingNumbersGroup, targetOrders: OrderShipOut[]) {

    const request = new OrderShipOutTrackingNumberIssue();

    request.carrierId = carrierTrackingsNumbersGroup.carrierId;
    request.branchId = carrierTrackingsNumbersGroup.branchId;
    request.companyGroupId = carrierTrackingsNumbersGroup.companyGroupId;
    request.carrierTrackingIssues = [];

    for (const order of targetOrders) {
      request.carrierTrackingIssues.push({
        orderShipOutId: order.id,
        trackingNumber: order.trackingNumber,
        oldTrackingNumber: order.oldTrackingNumber
      });
    }    

    this.carrierTrackingNumberRangeService.post('issue/', request).subscribe(
      response => {
        // 업데이트 결과를 적용.
        const carrierTrackingIssues = response.model as CarrierTrackingIssueDto[];
        for (const tracking of carrierTrackingIssues) {
          for (const order of targetOrders) {
            if (tracking.orderShipOutId === order.id) {
              order.trackingNumber = tracking.trackingNumber;
              order.oldTrackingNumber = tracking.oldTrackingNumber;
              order.carrierId = carrierTrackingsNumbersGroup.carrierId;
              order.carrierBranchId = carrierTrackingsNumbersGroup.branchId;
            }
          }
        }

        this.messageHelper.showSavedSuccess(false, this.translator.get('common.word.preTrackingNumber'));
        this.trackingAssignTrigger.next('numbersGroup');
      },
      error => {
        this.alertService.stopLoadingMessage();

        // 발급할 송장번호가 부족해서 모두 발급받지 못했다면, 송장발급실패했다고 오류를 표시한다.
        if (error.error && error.error.errorCode === OliveBackEndErrors.DataShortageError) {
          this.notifyNotEnoughCarrierTrackingsNumbersGroups(
            this.translator.get('sales.pendingOrderShipOutList.trackingNumbersShortageErrorMessage')
            );
        }
        else {
          this.messageHelper.showStickySaveFailed(error, false);
        }

        this.trackingAssignTrigger.next();
      }
    );
  }

  /**
   * 선발급 송장번호대가 없을 경우 없다고 알린후 송장번호 등록 페이지를 안내
   */
  notifyNotEnoughCarrierTrackingsNumbersGroups(errorMessage: string) {
    this.alertService.showDialog(
      this.translator.get('common.title.errorConfirm'),
      errorMessage,
      DialogType.confirm,
      () => {
        this.router.navigateByUrl('/bases/carrierTrackingNumberRange');
      },
      () => null,
      this.translator.get('common.button.yes'),
      this.translator.get('common.button.no')
    );
  }

  /**
   * 선택 다이알로그를 팝업
   * @param carrierTrackingsNumbersGroups 
   */  
  popUpSelectCarrierTrackingsNumbersGroupsDialog(carrierTrackingsNumbersGroups: CarrierTrackingNumbersGroup[]) {
    const params: IdName[] = [];
    // 라디오 선택창에 보낼 데이터 만들기
    for (const group of carrierTrackingsNumbersGroups) {
      const names: string[] = [];
      names.push(group.carrierName);
      if (group.branchId) {
        names.push(`${this.translator.get('common.word.branch')}: ${group.branchCode}`);
      }
      if (group.companyGroupId) {
        names.push(`${this.translator.get('common.word.companyGroup')}: ${group.companyGroupName}`);
      }
      names.push(`${this.translator.get('common.word.availTrackingNumbers')}: ${group.availNumbers}`);
      params.push({ id: group.id, name: names.join(',') });
    }
    const dialogRef = this.dialog.open(OliveSelectOneDialogComponent, {
      disableClose: false,
      panelClass: 'mat-dialog-md',
      data: {
        title: this.translator.get('sales.pendingOrderShipOutList.selectCarrierTrackingNumbersGroupsTitle'),
        description: this.translator.get('sales.pendingOrderShipOutList.selectCarrierTrackingNumbersGroupsDescription'),
        items: params,
        oneClick: true
      } as OliveSelectOneSetting
    });
    return dialogRef;
  }
  
  /**
   * 주문 아이템 무게 합을 구한다.
   * @param order OrderShipOut
   * @returns 합산값
   */
  getOrderShipOutKiloWeightDue(order: OrderShipOut): number {
    return order.orderShipOutDetails
      .map(x => this.getItemKiloWeightLineDue(x))
      .reduce((a, b) => a + (b || 0), 0);
  }

  /**
   * Gets item kilo weight line due
   * @param item 
   * @returns item kilo weight line due 
   */
  getItemKiloWeightLineDue(item: OrderShipOutDetail): number {
    return this.getItemKiloWeight(item) * item.quantity;
  }

  /**
   * Gets item weight
   * @param item OrderShipOutDetail
   * @returns item weight (Kilo)
   */
  getItemKiloWeight(item: OrderShipOutDetail): number {
    return this.getOverrideKiloWeight(item) || item.kiloGramWeight;
  }

  /**
   * 파운드로 입력된 무게는 킬로그램으로 변환
   * @param item OrderShipOutDetail
   * @returns 킬로 무게
   */
  getOverrideKiloWeight(item: OrderShipOutDetail): number {
    let kiloWeight: number;

    if (item.extra == null || !item.extra.customsWeight) {
      return null;
    }

    kiloWeight = item.extra.customsWeight;

    if (item.extra.customsWeightTypeCode === OliveConstants.weightTypeCode.Pound) {
      kiloWeight = kiloWeight * OliveConstants.unitConversionRate.poundToKilo;
    }

    return +numberFormat(kiloWeight, 2);
  }
}
