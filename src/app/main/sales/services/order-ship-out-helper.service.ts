import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { String } from 'typescript-string-operations';

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
import { CustomsRule } from 'app/main/shippings/models/customs/customs-rule.model';
import { Icon } from 'app/core/models/icon';
import { Country } from 'app/main/supports/models/country.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';

class CustomsTypeDue {
  quantity: number;
  price: number;
  oneItemMaxQuantities: Map<number, number>;

  public constructor(init?: CustomsTypeDue) {
    Object.assign(this, init);
  }
}

@Injectable({
  providedIn: 'root'
})
export class OliveOrderShipOutHelperService {
  trackingAssignTrigger = new Subject<any>();

  constructor
    (
      private translator: FuseTranslationLoaderService, private dialog: MatDialog,
      private alertService: AlertService, private messageHelper: OliveMessageHelperService,
      private carrierTrackingNumberRangeService: OliveCarrierTrackingNumberRangeService,
      private router: Router,
  ) {
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

  /**
   * Gets item custom price
   * @param item 
   * @returns item custom price 
   */
  getItemCustomsPrice(item: OrderShipOutDetail): number {
    return (item.extra && item.extra.customsPrice || item.customsPrice) * item.quantity;
  }

  /**
   * 통관코드별 상품수량합, 가격합, 제품별 수량합 계산
   * @param order 
   * @param customsRule 
   * @param stat 
   * @returns order customs type codes stat 
   */
  getOrderCustomsTypeStats(order: OrderShipOut, customsTypeStats: Map<string, CustomsTypeDue>): void {
    for (const item of order.orderShipOutDetails) {
      for (const customsTypeCode of item.customsTypeCode.split(',')) {
        const customsTypeCodeKey = customsTypeCode.toUpperCase();
        const productId = item.productVariantId;

        if (customsTypeStats.has(customsTypeCodeKey)) {
          const customsTypeDue = customsTypeStats.get(customsTypeCodeKey);

          const productQuantities = customsTypeDue.oneItemMaxQuantities;

          if (productQuantities.has(productId)) {
            productQuantities.set(productId, productQuantities.get(productId) + item.quantity);
          }
          else {
            productQuantities.set(productId, item.quantity);
          }

          customsTypeDue.quantity += item.quantity;
          customsTypeDue.price += this.getItemCustomsPrice(item);
          customsTypeDue.oneItemMaxQuantities = productQuantities;
        }
        else {
          customsTypeStats.set(customsTypeCodeKey, {
            quantity: item.quantity,
            price: this.getItemCustomsPrice(item),
            oneItemMaxQuantities: new Map<number, number>([[productId, item.quantity]])
          });
        }
      }
    }
  }

  /**
   * 통관문제 경고 아이콘 생성
   * @param orders 
   * @param customsRule 
   * @param groupCustomsTypeMap 
   * @returns customs warning icon 
   */
  getCustomsWarningIcon(orders: OrderShipOut[], customsRule: CustomsRule, groupCustomsTypeMap: Map<string, Set<string>>): Icon {
    const customsTypeStats = new Map<string, CustomsTypeDue>();

    for (const order of orders) {
      this.getOrderCustomsTypeStats(order, customsTypeStats);
    }

    for (const customsTypeCode of Array.from(customsTypeStats.keys())) {
      const warning = customsRule.warnings.find(x => x.typeCode === customsTypeCode);

      if (!warning) {
        console.error('customsRule.warnings is empty');
        return null;
      }

      const customsTypeQuantity = customsTypeStats.get(customsTypeCode).quantity;

      if
        (
        // 예) 건기식 6병 제한
        warning.sameTypeMaxQuantity !== null &&
        customsTypeQuantity > warning.sameTypeMaxQuantity
      ) {
        return {
          name: OliveConstants.shipOutIcon.customsSameTypeMaxQuantityIcon,
          tooltip: String.Format(this.translator.get('common.message.sameTypeMaxQuantityStatus'), warning.typeCode, warning.sameTypeMaxQuantity)
        };
      }

      // 예) 전자 제품 제품별 1개 제한
      if (warning.oneItemMaxQuantity !== null) {
        const productMap = customsTypeStats.get(customsTypeCode).oneItemMaxQuantities;
        for (const quantity of Array.from(productMap.values())) {
          if (quantity > warning.oneItemMaxQuantity) {
            return {
              name: OliveConstants.shipOutIcon.customsOneItemMaxQuantityIcon,
              tooltip: String.Format(this.translator.get('common.message.oneItemMaxQuantityStatus'), warning.typeCode, warning.oneItemMaxQuantity, quantity)
            };
          }
        }
      }

      // 금액 제한 통관 경고
      if (warning.totalMaxPrice == null) {
        continue;
      }

      // 일반, 목록 같은 같은 그룹
      let sameGroupCustomsTypeCodes: string[];
      for (const groupSet of Array.from(groupCustomsTypeMap.values())) {
        if (groupSet.has(customsTypeCode)) {
          sameGroupCustomsTypeCodes = Array.from(groupSet.values());
          break;
        }
      }

      if (sameGroupCustomsTypeCodes === null) {
        console.error('sameGroupCustomsTypeCodes is null');
        continue;
      }

      // 예) 일반 / 목록통관이 섞여 있는 경우
      const intersection = sameGroupCustomsTypeCodes.filter(x => Array.from(customsTypeStats.keys()).includes(x));
      const isMixedCustomsType = intersection.length > 1;

      // 다른 통관코드를 허용하지 않는데 다른 통관코드가 섞여 있을 경우 해당사항이 없으므로 스킵한다.
      // 예) 목록통관의 경우 일반통관건이 섞여 있으면 더이상 목록통관이 아니다.
      if (warning.pureTypeCode && isMixedCustomsType) {
        continue;
      }

      let totalPrice = 0;
      for (const interSectionCustomsTypeCode of intersection) {
        totalPrice += customsTypeStats.get(interSectionCustomsTypeCode).price;
      }

      if (totalPrice > warning.totalMaxPrice) {
        return {
          name: OliveConstants.shipOutIcon.customsTotalMaxPriceIcon,
          tooltip: String.Format(this.translator.get('common.message.totalMaxPriceStatus'), warning.typeCode, warning.totalMaxPrice, totalPrice)
        };
      }
    }

    return null;
  }

  /**
   * 국가 그룹 CustomsRule을 만든다.
   * @param countryIds 
   * @returns country rules 
   */
  // TODO : 성능개선
  // 계속 Render할때마다 동일한것을 계속 하는데. 각 Warehouse별로 초기화시 한번만 하면 된다.
  // 그렇다면 리스트 주문들이 모두 동일한 국가여야 하는데 현재는 배송지역이 동일 싱글 국가지만 멀티 국가인 경우는 어떻게 처리하나?
  // 해결책 : 출고화면 시작시 배송국가가 멀티인경우 선택하는 기능을 추가해야 한다.
  getCountryCustomsRules(countryIds: Set<number>, customsConfigs: Map<string, any>, countries: Map<number, Country>): Map<string, any> {
    const configs = new Map<string, any>();

    // 입력타입코드 정의
    let key = (OliveConstants.customsRule.typeCodes).toUpperCase();
    configs.set(key, customsConfigs.get(key));

    for (const countryId of Array.from(countryIds.keys())) {
      // 국가 ID를 국가 코드로 변환
      const countryCode = countries.get(countryId).code;

      // 해당 국가코드 통관규칙
      key = (OliveConstants.customsRule.ruleCountryCode + countryCode).toUpperCase();
      configs.set(key, customsConfigs.get(key));
    }

    return configs;
  }

  getCustomsRule(countryId: number, countries: Map<number, Country>, customsConfigs: Map<string, any>): CustomsRule {
    const countryCode = countries.get(countryId).code;
    const customsRuleKey = (OliveConstants.customsRule.ruleCountryCode + countryCode).toUpperCase();

    return customsConfigs.get(customsRuleKey) as CustomsRule;
  }

  getGroupCustomsTypeMap(customsRule: CustomsRule): Map<string, Set<string>> {
    const groupCustomsTypeMap = new Map<string, Set<string>>();

    for (const customsType of customsRule.types.filter(x => x.groupCode !== null)) {
      if (groupCustomsTypeMap.has(customsType.groupCode)) {
        const codeSet = groupCustomsTypeMap.get(customsType.groupCode);
        codeSet.add(customsType.code);
        groupCustomsTypeMap.set(customsType.groupCode, codeSet);
      }
      else {
        groupCustomsTypeMap.set(customsType.groupCode, new Set<string>([customsType.code]));
      }
    }

    return groupCustomsTypeMap;
  }
}
