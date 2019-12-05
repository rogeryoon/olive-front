import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { String } from 'typescript-string-operations';
import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService, DialogType } from '@quick/services/alert.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { InventoryWarehouse } from 'app/main/productions/models/inventory-warehouse';
import { OliveSelectOneDialogComponent } from 'app/core/components/dialogs/select-one-dialog/select-one-dialog.component';
import { OliveSelectOneSetting } from 'app/core/interfaces/dialog-setting/select-one-setting';
import { IdName } from 'app/core/models/id-name';
import { OliveOrderShipOutPackageService } from 'app/main/sales/services/order-ship-out-package.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveOnShare } from 'app/core/interfaces/on-share';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveOrderShipOutManagerComponent } from '../../order-ship-out/order-ship-out-manager/order-ship-out-manager.component';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OrderShipOutDetail } from 'app/main/sales/models/order-ship-out-detail.model';
import { OliveProductWeightEditorComponent } from 'app/main/productions/products/product/product-weight-editor/product-weight-editor.component';
import { OliveProductService } from 'app/main/productions/services/product.service';
import { ProductWeight } from 'app/main/productions/models/product-weight.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { ProductCustomsPrice } from 'app/main/productions/models/product-customs-price.model';
import { OliveProductCustomsPriceEditorComponent } from 'app/main/productions/products/product/product-customs-price-editor/product-customs-price-editor.component';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';
import { OrderShipOutDetailExtra } from 'app/main/sales/models/order-ship-out-detail-extra.model';
import { OliveOrderShipOutService } from 'app/main/sales/services/order-ship-out.service';
import { OliveConstants } from 'app/core/classes/constants';
import { ProductHsCode } from 'app/main/productions/models/product-hs-code.model';
import { OliveProductHsCodesEditorComponent } from 'app/main/productions/products/product/product-hs-codes-editor/product-hs-codes-editor.component';
import { ProductCustomsTypeCode } from 'app/main/productions/models/product-customs-type-code.model';
import { Country } from 'app/main/supports/models/country.model';
import { isCustomsTypeCodeError } from 'app/core/validators/customs-validators';
import { OliveProductCustomsTypeCodesEditorComponent } from 'app/main/productions/products/product/product-customs-type-codes-editor/product-customs-type-codes-editor.component';
import { CarrierTrackingNumbersGroup } from 'app/main/shippings/models/carrier-tracking-numbers-group.model';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { OliveOrderShipOutHelperService } from 'app/main/sales/services/order-ship-out-helper.service';
import { Icon } from 'app/core/models/icon';
import { OliveOrderTrackingExcelService } from 'app/main/sales/services/order-tracking-excel.service';

class AllocatedQuantity {
  productVariantId: number;
  quantity: number;
}

@Component({
  selector: 'olive-pending-order-ship-out-list',
  templateUrl: './pending-order-ship-out-list.component.html',
  styleUrls: ['./pending-order-ship-out-list.component.scss']
})
export class OlivePendingOrderShipOutListComponent extends OliveEntityFormComponent {
  @Input()
  warehouse: Warehouse;

  @Input()
  index: number;

  parentObject: OliveOnShare;

  /**
   * 상품별 부족 수량 정리
   */
  shortInventories = new Map<number, number>();
  inventories = new Map<number, number>();

  /**
   * 모든 창고탭에 전역으로 사용됨
   */
  orders: OrderShipOut[] = [];

  /**
   * 필더된 오더
   */
  filteredOrders: OrderShipOut[] = null;

  /**
   * 오더에 매칭한 기대수량과 실제 할당 수량을 저장
   */
  ordersQuantities = new Map<number, AllocatedQuantity[]>();
  countries: Map<number, Country>;
  carrierTrackingNumbersGroups: CarrierTrackingNumbersGroup[];


  /**
   * 세관 통관 규칙
   */
  customsConfigs: Map<string, any>;

  /**
   * 같은 묶음배송 그룹 안에서 어떻게 묶였는지를 기록
   */
  combinedShippingGroups: Map<string, Array<string>>;

  productCustomsPriceSelectedTrigger: Subject<any> = new Subject();
  productCustomsWeightSelectedTrigger: Subject<any> = new Subject();

  trackingAssignTriggerSubscription: Subscription;

  selectedAll: any;

  saveOrder: OrderShipOut;

  filterHasShipOutProblems = null;
  filterKeyword = '';
  filterCombinedShipping = null;
  filterShortItems = null;
  filterCustomsIssues = null;

  @Output() shipOutFinished = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  tableId = 'left-' + Math.floor(Math.random() * 100000);

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private dialog: MatDialog, private alertService: AlertService,
    private orderShipOutPackageService: OliveOrderShipOutPackageService,
    private messageHelper: OliveMessageHelperService, private orderShipOutService: OliveOrderShipOutService,
    private productService: OliveProductService, private cacheService: OliveCacheService,
    private queryParams: OliveQueryParameterService, private orderShipOutHelperService: OliveOrderShipOutHelperService,
    private documentService: OliveDocumentService, private orderTrackingExcelService: OliveOrderTrackingExcelService
  ) {
    super(
      formBuilder, translator
    );
  }
  get isloading(): boolean {
    return this.parentObject && this.parentObject.bool1;
  }

  setIsLoading(value: boolean) {
    this.parentObject.bool1 = value;
  }

  get canCombineShip(): boolean {
    const firstOrder = this.selectedOrders.find(x => x.dupAddressName != null && x.combinedShipAddressName == null);

    if (!firstOrder) { return false; }

    return this.selectedOrders.length > 1 && this.selectedOrders
      .every(x => x.dupAddressName === firstOrder.dupAddressName && x.combinedShipAddressName == null);
  }

  get canReleaseCombineShip(): boolean {
    const firstOrder = this.selectedOrders.find(x => x.dupAddressName != null && x.combinedShipAddressName != null);

    if (!firstOrder) { return false; }

    return this.selectedOrders.length > 1 && this.selectedOrders
      .every(x => x.dupAddressName === firstOrder.dupAddressName && x.combinedShipAddressName != null);
  }

  get allCheckboxesDisabled(): boolean {
    let allDisabled = true;
    for (let index = 0; index < this.allOrders.length; index++) {
      const order = this.allOrders[index];

      if (!this.hasShipOutProblems(order)) {
        allDisabled = false;
        break;
      }
    }

    return allDisabled;
  }

  get allOrders(): OrderShipOut[] {
    if (this.filteredOrders) {
      return this.filteredOrders;
    }
    return this.orders;
  }

  set allOrders(value: OrderShipOut[]) {
    this.orders = value;
  }

  get selectedOrders(): OrderShipOut[] {
    return this.allOrders.filter(x => x.choices[this.index]);
  }

  get filtered(): boolean {
    return this.filterHasShipOutProblems != null ||
      this.filterCombinedShipping != null ||
      this.filterShortItems != null ||
      this.filterCustomsIssues != null ||
      this.filterKeyword.length > 0;
  }

  get hasSelectedItems(): boolean {
    return this.selectedOrders.length > 0;
  }

  /**
   * 선택 합배송 주문 총액을 반환
   */
  get remarkCombinedOrders(): string {
    if (!this.canCombineShip || this.canReleaseCombineShip) { return ''; }

    let totalAmount = 0;

    this.selectedOrders.forEach(order => {
      totalAmount += this.getOrderShipOutCustomsPriceDue(order);
    });

    return ` (${this.cacheService.showMoney(totalAmount)})`;
  }

  get remarkSelectedOrders(): string {
    const listableCount = this.selectedOrders.length;
    let totalWeight = 0;

    this.selectedOrders.forEach(order => {
      totalWeight += this.getOrderShipOutKiloWeightDueLocal(order);
    });

    return listableCount === 0 ? '' : ` (${this.commaNumber(listableCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  get remarkAllOrders(): string {
    let nullWeightExists = false;
    let totalWeight = 0;

    this.allOrders.forEach(order => {
      totalWeight += this.getOrderShipOutKiloWeightDueLocal(order);

      if (!nullWeightExists) {
        nullWeightExists = this.foundNullWeight(order);
      }
    });

    const totalRows = this.allOrders.length;

    return totalRows === 0 ? '' : ` (${this.commaNumber(totalRows)}/${this.commaNumber(totalWeight)}Kg${nullWeightExists ? '-?' : ''})`;
  }

  /**
   * 키워드 검색 입력 이벤트 처리
   * @param searchValue 
   */
  onSearchChange(searchValue: string) {
    this.filterKeyword = searchValue.trim();

    if (this.filterKeyword.length === 0 && !this.filtered) {
      this.buttonRemoveFilters();
      return;
    }

    this.filterOrders();
  }

  /**
   * Filters orders
   */
  private filterOrders() {
    this.filteredOrders = this.orders;
    const keyword = this.filterKeyword.toLowerCase();
    if (keyword.length > 0) {
      this.filteredOrders = this.filteredOrders.filter(order =>
        order.orderFk.marketSellerFk.code && order.orderFk.marketSellerFk.code.toLowerCase().includes(keyword) ||
        order.orderFk.marketOrderNumber && order.orderFk.marketOrderNumber.toLowerCase().includes(keyword) ||
        order.deliveryTagFk.consigneeName && order.deliveryTagFk.consigneeName.toLowerCase().includes(keyword) ||
        order.trackingNumber && order.trackingNumber.toLowerCase().includes(keyword) ||
        order.orderShipOutDetails.find(x => x.name && x.name.toLowerCase().includes(keyword)));
    }

    // 합배송건
    if (this.filterCombinedShipping) {
      this.filteredOrders = this.filteredOrders.filter(order => this.getTailedDupAddressName(order).length > 0);
    }
    // 단일배송건
    else if (this.filterCombinedShipping === false) {
      this.filteredOrders = this.filteredOrders.filter(order => this.getTailedDupAddressName(order).length === 0);
    }

    // 출고 불가건
    if (this.filterHasShipOutProblems) {
      this.filteredOrders = this.filteredOrders.filter(order => this.hasShipOutProblems(order));
    }
    // 출고 가능건
    else if (this.filterHasShipOutProblems === false) {
      this.filteredOrders = this.filteredOrders.filter(order => !this.hasShipOutProblems(order));
    }

    // 재고 보유건
    if (this.filterShortItems) {
      this.filteredOrders = this.filteredOrders.filter(order => this.isShortOrderQuantity(order));
    }
    // 재고 미보유건
    else if (this.filterShortItems === false) {
      this.filteredOrders = this.filteredOrders.filter(order => !this.isShortOrderQuantity(order));
    }

    // 통관 문제건
    if (this.filterCustomsIssues) {
      this.filteredOrders = this.filteredOrders.filter(order => this.getCustomsWarningIcon(order));
    }
    // 통관 문제 정상건
    else if (this.filterCustomsIssues === false) {
      this.filteredOrders = this.filteredOrders.filter(order => !this.getCustomsWarningIcon(order));
    }    
  }

  /**
   * Determines whether ship out problems has
   * @param order 
   * @returns true if ship out problems 
   */
  hasShipOutProblems(order: OrderShipOut): boolean {
    return this.isShortOrderQuantity(order) || this.foundNullWeight(order) || 
      this.foundNullCustomsPrice(order) || this.foundCustomTypeCodeEntryError(order, this.customsConfigs);
  }

  setConfigs(configType: string, data: any) {
    switch (configType) {
      case OliveConstants.listerConfigType.customsConfigs:
        this.customsConfigs = data;
        break;

      case OliveConstants.listerConfigType.countries:
        this.countries = data;
        break;

      case OliveConstants.listerConfigType.carrierTrackingNumbersGroups:
        this.carrierTrackingNumbersGroups = data;
        break;
    }
  }

  /**
   * 주문 아이템 세관신고 합을 구한다.
   * @param order OrderShipOut
   * @returns 합산값
   */
  getOrderShipOutCustomsPriceDue(order: OrderShipOut) {
    return order.orderShipOutDetails
      .map(x => this.orderShipOutHelperService.getItemCustomsPrice(x))
      .reduce((a, b) => a + (b || 0), 0);
  }

  /**
   * 주문 아이템 무게 합을 구한다.
   * @param order OrderShipOut
   * @returns 합산값
   */
  getOrderShipOutKiloWeightDueLocal(order: OrderShipOut): number {
    return this.orderShipOutHelperService.getOrderShipOutKiloWeightDue(order);
  }

  /**
   * Selects all
   */
  selectAll() {
    this.allOrders.forEach(order => {
      order.choices[this.index] = this.selectedAll && !this.hasShipOutProblems(order);
    });
  }

  /**
   * Checks if all selectedㄴ
   */
  checkIfAllSelected() {
    this.selectedAll = this.allOrders.every(x => x.choices[this.index]);
  }

  /**
   * 묶음배송 체크 자동선택
   * @param thisOrder 
   */
  checkSameCombinedShippingGroup(thisOrder: OrderShipOut) {
    if (!thisOrder.choices[this.index] && thisOrder.dupAddressName) {
      const thisOrderTailedDupAddressName = this.getTailedDupAddressName(thisOrder);
      this.allOrders.forEach(order => {
        if
          (
          !order.choices[this.index]
          && thisOrderTailedDupAddressName === this.getTailedDupAddressName(order) &&
          !this.hasShipOutProblems(order)
        ) {
          order.choices[this.index] = true;
        }
      });
    }
  }

  /**
   * Starts table
   * @param orders 
   * @param inventories 
   * @param parentObject 
   * @param refresh 
   */
  startTable(orders: OrderShipOut[], inventories: InventoryWarehouse[], parentObject: any, refresh: boolean) {
    this.parentObject = parentObject;

    this.combinedShippingGroups = new Map<string, Array<string>>();

    this.allOrders = orders;

    this.setWarehouseInventories(inventories);

    this.allocateOrderInventories();

    if (!refresh) {
      this.initialize();
    }
  }

  /**
   * Initializes olive pending order ship out list component
   */
  initialize() {
    this.productCustomsPriceSelectedTrigger.subscribe(param => {
      // 백앤드에서 상품가격 받음
      this.productService.get(`customsPrice/${param.editItem.productVariantId}/`).subscribe(
        response => this.updateCustomsPrice(param.order, param.editItem, response.model),
        error => this.messageHelper.showLoadFailedSticky(error)
      );
    });

    this.productCustomsWeightSelectedTrigger.subscribe(param => {
      // 백앤드에서 상품무게 받음
      this.productService.get(`weight/${param.editItem.productVariantId}/`).subscribe(
        response => this.updateProductWeight(param.order, param.editItem, response.model),
        error => this.messageHelper.showLoadFailedSticky(error)
      );
    });

    // Tracking 번호 트랙잭션이 종료되면
    this.trackingAssignTriggerSubscription = this.orderShipOutHelperService.trackingAssignTrigger.subscribe(param => {
      this.setIsLoading(false);
      if (param) {
        this.reload.emit(param);
      }
    });
  }

  /**
   * Allocates order inventories
   */
  private allocateOrderInventories() {
    for (const order of this.allOrders) {
      const orderQuantities: AllocatedQuantity[] = [];

      let shortage = false;
      for (const item of order.orderShipOutDetails) {
        let allocatedQuantity = 0;
        let currentQuantity = this.inventories.get(item.productVariantId);

        // 부분 품절인 경우 전체 주문은 나갈수 없으므로 재고를 빼면 안됨
        if (currentQuantity - item.quantity >= 0 && !shortage) {
          allocatedQuantity = item.quantity;
          currentQuantity -= item.quantity;
          this.inventories.set(item.productVariantId, currentQuantity);
        }

        orderQuantities.push({
          productVariantId: item.productVariantId,
          quantity: allocatedQuantity
        });

        // 부족수량 => 정리/저장
        if (!allocatedQuantity) {
          let shortQuantity = this.shortInventories.get(item.productVariantId);

          if (!shortQuantity) {
            shortQuantity = 0;
          }

          shortQuantity += item.quantity;

          this.shortInventories.set(item.productVariantId, shortQuantity);

          shortage = true;
        }
      }

      this.ordersQuantities.set(order.id, orderQuantities);
    }
  }

  /**
   * Sets warehouse inventories
   * @param inventories 
   */
  private setWarehouseInventories(inventories: InventoryWarehouse[]) {
    for (const item of inventories) {
      const founded = item.inventories.find(x => x.id === this.warehouse.id);
      if (founded) {
        this.inventories.set(item.id, founded.value);
      }
    }
  }

  showInventory(order: OrderShipOut): string {
    return `${this.getActualQuantity(order)} / ${this.getOrderQuantity(order)}`;
  }

  showItem(item: OrderShipOutDetail): string {
    return OliveDocumentService.numToAlpha(item.productVariantShortId - 1) + item.quantity;
  }

  getOrderQuantity(order: OrderShipOut): number {
    return order.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + b);
  }

  getActualQuantity(order: OrderShipOut): number {
    return this.ordersQuantities.get(order.id).map(x => x.quantity).reduce((a, b) => a + b);
  }

  isShortOrderQuantity(order: OrderShipOut): boolean {
    return this.getShortOrderQuantity(order) !== 0;
  }

  getShortOrderQuantity(order: OrderShipOut): number {
    return this.getActualQuantity(order) - this.getOrderQuantity(order);
  }

  popUpCustomTypeCodeEntries(): void {
    this.checkCustomsTypeCodeEntries(false);
  }

  /**
   * 출고 오류 문맥에 따라 편집창을 다르게 팝업
   * @param order 
   * @param icon 
   */
  contextPopUp(order: OrderShipOut, icon: Icon) {
    // 아이콘 없는 콜은 현재 사용되지 않음 
    // TD에서 클릭하는 이벤트 문맥에 근거하여 팝업을 띄우려고 했으나
    // 아이콘 클릭 이벤트랑 중첩되어 팝업이 이중으로 뜨는 문제가 발생 잠정 중단
    if (!icon) {
      if (this.foundNullWeight(order)) {
        this.popUpItemsWeightEntry(order);
      }
      else if (this.foundNullCustomsPrice(order)) {
        this.popUpCustomsPriceEntry(order);
      }
      else if (this.foundCustomTypeCodeEntryError(order, this.customsConfigs)) {
        this.popUpCustomTypeCodeEntries();
      }
      return;
    }

    switch (icon.name) {
      case OliveConstants.shipOutIcon.nullWeightIcon:
        this.popUpItemsWeightEntry(order);
        break;

      case OliveConstants.shipOutIcon.nullCustomsPriceIcon:
        this.popUpCustomsPriceEntry(order);
        break;

      case OliveConstants.shipOutIcon.customsTypeCodeErrorIcon:
        this.popUpCustomTypeCodeEntries();
        break;

      case OliveConstants.shipOutIcon.customsTotalMaxPriceIcon:
        this.popUpCustomsPriceEntry(order);
        break;

      default:
        this.popUpOrderEntry(order);
        break;
    }
  }

  /**
   * 국가별 필수 통관코드 입력 체크
   * @param order 
   * @returns true if no input custom type code 
   */
  foundCustomTypeCodeEntryError(order: OrderShipOut, customsRules: Map<string, any>): boolean {
    return !this.isNull(order.orderShipOutDetails.find(x => isCustomsTypeCodeError(x.customsTypeCode, customsRules, true) != null));
  }

  /**
   * 널이 있는 무게가 존재 체크
   * @param order 
   * @returns true if null weight 
   */
  foundNullWeight(order: OrderShipOut): boolean {
    return !this.isSameCountry(this.warehouse, order) &&
      !this.isNull(order.orderShipOutDetails.find(x => x.kiloGramWeight == null && (x.extra == null || x.extra.customsWeight == null)));
  }

  showWeight(order: OrderShipOut): string {
    const weightDue = this.getOrderShipOutKiloWeightDueLocal(order);

    const foundNull = this.foundNullWeight(order);

    if (weightDue === 0) {
      return '?';
    }

    return this.numberFormat(weightDue, 2) + (foundNull ? ' ?' : '');
  }

  /**
   * Determines whether pending combined dup address name is
   * 예) A1 : 합배송 처리됨, B : 합배송대상
   * @param dupAddressName 
   * @returns true if pending combined dup address name 
   */
  isPendingCombinedDupAddressName(dupAddressName: string): boolean {
    return dupAddressName.length === 0 || isNaN(+dupAddressName[dupAddressName.length - 1]);
  }

  combinedShippingSummary(thisOrder: OrderShipOut): string {
    const thisOrderTailedDupAddressName = this.getTailedDupAddressName(thisOrder);

    // 끝에 자리가 숫자로 끝나지 않는 합배송은 아직까지 합배송처리가 안되었기때문에 생략
    if (this.isPendingCombinedDupAddressName(thisOrderTailedDupAddressName)) {
      return '';
    }

    let totalAmount = 0;
    let totalCount = 0;
    let primaryName = '';

    this.allOrders.filter(x => this.getTailedDupAddressName(x) === thisOrderTailedDupAddressName).forEach(order => {
      if (this.getTailedDupAddressName(order) === thisOrderTailedDupAddressName) {
        totalAmount += this.getOrderShipOutCustomsPriceDue(order);
        totalCount++;
      }
      if (order.combinedShipAddressIsPrimary) {
        primaryName = order.deliveryTagFk.consigneeName;
      }
    });

    return `${primaryName} : Total ${totalCount} Orders(${this.cacheService.showMoney(totalAmount)})`;
  }

  /**
   * 편집 상품 가져오기
   * @param order OrderShipOut
   */
  getEditItem(order: OrderShipOut, subject: any): void {
    let editItem = order.orderShipOutDetails[0];
    // 아이템이 2개이상일 경우 선택
    if (order.orderShipOutDetails.length > 1) {
      const params: IdName[] = [];

      // 라디오 선택창에 보낼 데이터 만들기
      let remark = '';
      for (const it of order.orderShipOutDetails) {
        const itemId = OliveDocumentService.numToAlpha(it.productVariantShortId - 1);
        if (subject === this.productCustomsWeightSelectedTrigger) {
          remark = it.kiloGramWeight ? this.numberFormat(it.kiloGramWeight, 2) : '?';
          if (it.extra && it.extra.customsWeight) {
            let weight = it.extra.customsWeight;
            if (it.extra.customsWeightTypeCode === OliveConstants.weightTypeCode.Pound) {
              weight = weight * OliveConstants.unitConversionRate.poundToKilo;
            }

            remark = this.numberFormat(weight, 2);
          }
          remark += 'Kg';
        }
        else if (subject === this.productCustomsPriceSelectedTrigger) {
          remark = it.customsPrice ? this.cacheService.showMoney(it.customsPrice, true) : '?';
          if (it.extra && it.extra.customsPrice) {
            remark = this.cacheService.showMoney(it.extra.customsPrice, true);
          }
        }

        params.push({ id: it.productVariantId, name: `${itemId}. [${remark}]-${it.name}` });
      }

      const dialogRef = this.dialog.open(
        OliveSelectOneDialogComponent,
        {
          disableClose: false,
          panelClass: 'mat-dialog-md',
          data: {
            title: this.translator.get('sales.pendingOrderShipOutList.selectProductTitle'),
            description: this.translator.get('sales.pendingOrderShipOutList.selectProductDescription'),
            items: params,
            oneClick: true
          } as OliveSelectOneSetting
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          editItem = order.orderShipOutDetails.find(x => x.productVariantId === result);
          subject.next({ order: order, editItem: editItem });
        }
      });
    }
    else {
      subject.next({ order: order, editItem: editItem });
    }
  }

  /**
   * 상품 무게 수정
   * @param order OrderShipOut
   */
  popUpItemsWeightEntry(order: OrderShipOut) {
    this.getEditItem(order, this.productCustomsWeightSelectedTrigger);
  }

  /**
   * Updates product weight
   * @param order OrderShipOut
   * @param editItem OrderShipOutDetail
   * @param weight ProductWeight
   */
  private updateProductWeight(order: OrderShipOut, editItem: OrderShipOutDetail, weight: ProductWeight) {
    const savedCustomsWeight = editItem.kiloGramWeight;
    let savedOverrideWeight = null;
    let savedOverrideWeightTypeCode = null;

    if (editItem.extra && editItem.extra.customsWeight) {
      savedOverrideWeight = editItem.extra.customsWeight;
    }

    if (editItem.extra && editItem.extra.customsWeightTypeCode) {
      savedOverrideWeightTypeCode = editItem.extra.customsWeightTypeCode;
    }

    // 상품 무게 수정창 오픈
    const itemId = OliveDocumentService.numToAlpha(editItem.productVariantShortId - 1);
    const setting = new OliveDialogSetting(
      OliveProductWeightEditorComponent,
      {
        item: weight,
        itemType: OrderShipOut,
        customTitle: `${itemId}. ${order.orderFk.marketSellerFk.code} - ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
        hideDelete: true,
        extraParameter: {
          productName: editItem.name,
          overrideWeight: editItem.extra && editItem.extra.customsWeight || null,
          overrideWeightTypeCode: editItem.extra && editItem.extra.customsWeightTypeCode || null,
        }
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    // 무게 업데이트
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 예외 적용 무게를 저장해야 한다면
        if (result.overrideCustomsWeight !== savedOverrideWeight || result.overrideWeightTypeCode !== savedOverrideWeightTypeCode) {
          if (!editItem.extra) {
            editItem.extra = new OrderShipOutDetailExtra();
          }

          editItem.extra.customsWeight = result.overrideCustomsWeight;
          // Weight이 Null이면 무게 타입 콤보도 Null처리한다. (값이 없는 무게 단위는 의미가 없다.)
          editItem.extra.customsWeightTypeCode = result.overrideCustomsWeight ? result.overrideWeightTypeCode : null;

          this.saveShipOutExtra(editItem);
        }

        let update = true;
        for (const od of this.allOrders) {
          for (const it of od.orderShipOutDetails.filter(x => x.productVariantId === weight.productVariantId)) {
            if (savedCustomsWeight === result.customsWeight) {
              update = false;
              break;
            }
            it.kiloGramWeight = result.customsWeight;
          }
          if (!update) {
            break;
          }
        }
      }
    });
  }

  /**
   * 세관신고 상품 금액 수정
   * @param order OrderShipOut
   */
  popUpCustomsPriceEntry(order: OrderShipOut) {
    this.getEditItem(order, this.productCustomsPriceSelectedTrigger);
  }

  /**
   * Updates product customs price on
   * @param order OrderShipOut
   * @param price ProductCustomsPrice
   */
  private updateCustomsPrice(order: OrderShipOut, editItem: OrderShipOutDetail, price: ProductCustomsPrice) {
    const savedCustomsPrice = editItem.customsPrice;
    let savedOverridePrice = null;

    if (editItem.extra && editItem.extra.customsPrice) {
      savedOverridePrice = editItem.extra.customsPrice;
    }

    // 세관신고 상품가격 수정창 오픈
    const itemId = OliveDocumentService.numToAlpha(editItem.productVariantShortId - 1);
    const setting = new OliveDialogSetting(
      OliveProductCustomsPriceEditorComponent,
      {
        item: price,
        itemType: OrderShipOut,
        customTitle: `${itemId}. [${this.translator.get('common.word.productCustomsPrice')}] ${order.orderFk.marketSellerFk.code} - 
        ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
        hideDelete: true,
        extraParameter: { productName: editItem.name, overrideCustomsPrice: editItem.extra && editItem.extra.customsPrice || null }
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    // 가격 업데이트
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 예외 적용 가격을 저장해야 한다면
        if (result.overrideCustomsPrice !== savedOverridePrice) {
          if (!editItem.extra) {
            editItem.extra = new OrderShipOutDetailExtra();
          }

          editItem.extra.customsPrice = result.overrideCustomsPrice;

          this.saveShipOutExtra(editItem);
        }

        let update = true;
        for (const od of this.allOrders) {
          for (const it of od.orderShipOutDetails.filter(x => x.productVariantId === price.productVariantId)) {
            if (savedCustomsPrice === result.customsPrice) {
              update = false;
              break;
            }
            it.customsPrice = result.customsPrice;
          }
          if (!update) {
            break;
          }
        }
      }
    });
  }

  /**
   * 예외 적용 가격, 이름, 중량등의 통관시 사용 부가정보를 백앤드에 저장
   * @param editItem OrderShipOutDetail
   */
  saveShipOutExtra(editItem: OrderShipOutDetail) {
    this.orderShipOutService.put(`extra/${editItem.id}/`, editItem.extra).subscribe(
      response => {
        editItem = response.model as OrderShipOutDetail;
      },
      error => this.messageHelper.showStickySaveFailed(error, false)
    );
  }

  showCustomsPrice(order: OrderShipOut): string {
    const priceDue = this.getOrderShipOutCustomsPriceDue(order);

    const foundNull = this.foundNullCustomsPrice(order);

    if (priceDue === 0) {
      return '?';
    }

    return this.cacheService.showMoney(priceDue) + (foundNull ? ' ?' : '');
  }

  /**
   * Shows items name
   * @param order 
   * @returns items name 
   */
  showItemsName(order: OrderShipOut): string {
    const itemsNames: string[] = [];

    for (const item of order.orderShipOutDetails) {
      const itemId = OliveDocumentService.numToAlpha(item.productVariantShortId - 1);
      itemsNames.push(`${itemId}. ${item.name} (${item.quantity})`);
    }

    return itemsNames.join(' , ');
  }

  /**
   * 널이 있는 가격이 있는지 조사
   * @param order 
   * @returns true if null price 
   */
  foundNullCustomsPrice(order: OrderShipOut): boolean {
    return !this.isSameCountry(this.warehouse, order) &&
      !this.isNull(order.orderShipOutDetails.find(x => x.customsPrice == null && (x.extra == null || x.extra.customsPrice == null)));
  }

  /**
   * Gets ship out status icons
   * @param order 
   * @returns ship out status icons 
   */
  getShipOutStatusIcons(order: OrderShipOut): Icon[] {
    const icons = new Array<Icon>();

    const shortageQuantity = this.getShortOrderQuantity(order);

    if (shortageQuantity !== 0) {
      icons.push({
        name: OliveConstants.shipOutIcon.shortageQuantityIcon,
        tooltip: `${this.translator.get('common.message.outOfStockStatus')} (${shortageQuantity})`
      });
    }

    if (this.foundNullWeight(order)) {
      icons.push({
        name: OliveConstants.shipOutIcon.nullWeightIcon,
        tooltip: this.translator.get('common.message.noWeightInputStatus')
      });
    }

    if (this.foundNullCustomsPrice(order)) {
      icons.push({
        name: OliveConstants.shipOutIcon.nullCustomsPriceIcon,
        tooltip: this.translator.get('common.message.noProductPriceInput')
      });

      return icons;
    }

    if (this.isSameCountry(this.warehouse, order)) {
      return icons;
    }

    const countryCustomRule = this.getCountryCustomsRules(new Set([order.deliveryAddressFk.countryId]));

    if (this.foundCustomTypeCodeEntryError(order, countryCustomRule)) {
      icons.push({
        name: OliveConstants.shipOutIcon.customsTypeCodeErrorIcon,
        tooltip: this.translator.get('common.message.customsTypeEntryStatus')
      });

      return icons;
    }

    const customsWarningIcon = this.getCustomsWarningIcon(order);
    if (customsWarningIcon) {
      icons.push(customsWarningIcon);
    }

    return icons;
  }

  /**
   * 통관문제 경고 아이콘 생성
   * @param thisOrder 
   * @returns customs warning icon 
   */
  getCustomsWarningIcon(thisOrder: OrderShipOut): Icon {
    const orders: OrderShipOut[] = [];
    orders.push(thisOrder);

    const thisOrderTailedDupAddressName = this.getTailedDupAddressName(thisOrder);

    // 합배송건을 찾아서 추가한다.
    if
      (
      thisOrderTailedDupAddressName.length > 1 &&
      // 끝에 자리가 숫자로 끝난 합배송은 합배송건을 찾아서 추가 집계한다.
      !isNaN(+thisOrderTailedDupAddressName[thisOrderTailedDupAddressName.length - 1])
    ) {
      this.allOrders.forEach(order => {
        if
          (
          order.id !== thisOrder.id &&
          thisOrderTailedDupAddressName === this.getTailedDupAddressName(order)
        ) {
          orders.push(order);
        }
      });
    }    

    const customsRule = this.orderShipOutHelperService.getCustomsRule(
      thisOrder.deliveryAddressFk.countryId, this.countries, this.customsConfigs);

    const groupCustomsTypeMap = this.orderShipOutHelperService.getGroupCustomsTypeMap(customsRule);

    return this.orderShipOutHelperService.getCustomsWarningIcon(orders, customsRule, groupCustomsTypeMap);
  }

  /**
   * 합배송 처리
   * @returns  
   */
  combineShip() {
    const canCombineShip = this.canCombineShip;
    if (!(canCombineShip || this.canReleaseCombineShip)) { return; }

    const combines = this.selectedOrders;

    // 합배송 취소 처리    
    if (!canCombineShip) {
      combines.forEach(order => {
        order.combinedShipAddressName = null;
        order.combinedShipAddressIsPrimary = false;
        this.updateCombinedShippingGroups(false);
      });
      this.unCheckSelectedOrders();
      return;
    }

    // 각 배달정보가 같은지 검사한다.
    const uniqueDeliveryInfoCheckSet = new Map<string, number>();
    combines.forEach(order => {
      const elements = [];
      elements.push(order.deliveryTagFk.consigneeName, order.deliveryTagFk.customsName, order.deliveryTagFk.customsId);
      uniqueDeliveryInfoCheckSet.set(elements.filter(x => x).join(','), order.id);
    });

    // 배달정보가 서로 다르다면 선택하게 한다
    if (uniqueDeliveryInfoCheckSet.size > 1) {
      const items: IdName[] = [];

      Array.from(uniqueDeliveryInfoCheckSet.keys()).forEach(key => {
        items.push({ id: uniqueDeliveryInfoCheckSet.get(key), name: key });
      });

      const dialogRef = this.dialog.open(
        OliveSelectOneDialogComponent,
        {
          disableClose: false,
          panelClass: 'mat-dialog-md',
          data: {
            title: this.translator.get('sales.pendingOrderShipOutList.selectDeliveryInfoTitle'),
            description: this.translator.get('sales.pendingOrderShipOutList.selectDeliveryInfoDescription'),
            items: items,
            oneClick: true
          } as OliveSelectOneSetting
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.setCombinedShippingPrimaryAddress(result);
        }
      });
    }
    else {
      this.setCombinedShippingPrimaryAddress(combines[0].id);
    }
  }

  /**
   * 같은 합배송 대상중에 나누어 묶인 서브 이름을 반환
   * @param order 
   * @returns tailed dup address name 
   */
  private getTailedDupAddressName(order: OrderShipOut): string {
    const orderIdsKeys = this.combinedShippingGroups.get(order.dupAddressName);
    if (!orderIdsKeys) {
      if (order.dupAddressName != null) {
        return order.dupAddressName;
      }
      return '';
    }

    let tailedIndex = 0;
    for (const orderIdsKey of orderIdsKeys) {
      tailedIndex++;

      if (orderIdsKey.split(',').find(x => +x === order.id)) {
        return order.dupAddressName + tailedIndex;
      }
    }

    return order.dupAddressName;
  }

  /**
   * 멀티 합배송이 어떻게 등록되었는지를 저장 
   * - 같은 합배송건중 나누어서 합배송 처리하는것 때문에 관리 필요
   * @param addMode 
   */
  private updateCombinedShippingGroups(addMode: boolean): void {
    const mapKey = this.selectedOrders[0].dupAddressName;

    const orderIdsKey = this.selectedOrders.map(x => x.id).join();

    let orderIdsKeys = [];

    // 추가
    if (addMode) {
      if (this.combinedShippingGroups.has(mapKey)) {
        orderIdsKeys = this.combinedShippingGroups.get(mapKey);
      }
      orderIdsKeys.push(orderIdsKey);
    }
    // 삭제
    else {
      orderIdsKeys = this.combinedShippingGroups.get(mapKey);
      if (orderIdsKeys) {
        const foundIndex = orderIdsKeys.indexOf(orderIdsKey);
        if (foundIndex !== -1) {
          orderIdsKeys.splice(foundIndex, 1);
        }
      }
    }

    if (!orderIdsKeys || orderIdsKeys.length === 0) {
      this.combinedShippingGroups.delete(mapKey);
    }
    else {
      this.combinedShippingGroups.set(mapKey, orderIdsKeys);
    }
  }

  /**
   * 멀티 합배송건중 우선주소를 설정
   * @param combinedShipDeliveryInfoSelectedOrderId 
   */
  private setCombinedShippingPrimaryAddress(combinedShipDeliveryInfoSelectedOrderId: number) {
    this.selectedOrders.forEach(order => {
      order.combinedShipAddressName = order.dupAddressName;
      if (order.id === combinedShipDeliveryInfoSelectedOrderId) {
        order.combinedShipAddressIsPrimary = true;
      }
    });

    this.updateCombinedShippingGroups(true);

    this.unCheckSelectedOrders();
  }

  private unCheckSelectedOrders() {
    this.selectedOrders.forEach(order => {
      order.choices[this.index] = false;
    });
  }

  popUpOrderEntry(order: OrderShipOut, startTabIndex = 0) {
    this.saveOrder = order;
    const setting = new OliveDialogSetting(
      OliveOrderShipOutManagerComponent,
      {
        item: _.cloneDeep(order),
        itemType: OrderShipOut,
        customTitle: `${order.orderFk.marketSellerFk.code} - ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
        startTabIndex: startTabIndex,
        customButtons: [
          { id: OliveConstants.customButton.splitOrder, iconName: 'call_split', titleId: 'common.word.splitOrder' }
        ]
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        // 분할 배송의 경우 Refresh한다.
        if (Array.isArray(item)) {
          this.showRefreshDialog(
            this.translator.get('sales.pendingOrderShipOutList.confirmRefreshAfterSplitOrders'),
            this.translator.get('common.title.confirm')
          );
        }
        else {
          const backup = _.cloneDeep(this.saveOrder);
          Object.assign(this.saveOrder, item);

          this.saveOrder.choices = _.cloneDeep(backup.choices);
          this.saveOrder.dupAddressName = backup.dupAddressName;
          this.saveOrder.combinedShipAddressName = backup.combinedShipAddressName;
          this.saveOrder.combinedShipAddressIsPrimary = backup.combinedShipAddressIsPrimary;
        }
      }
    });
  }

  isEntireItemsQuantityOk(order: OrderShipOut): boolean {
    return order.orderShipOutDetails.every(item => this.isEntireItemQuantityOk(item.productVariantId));
  }

  isEntireItemQuantityOk(productVariantId: number): boolean {
    return !this.shortInventories.get(productVariantId);
  }

  switchInventory(order: OrderShipOut) {
    if (!this.switchIconVisible(order)) {
      return;
    }

    const orderQuantities = this.ordersQuantities.get(order.id);
    // 정상 할당된 상품은 인벤토리로 반환하고 선택되었으면 선택도 언체크
    if (!this.isShortOrderQuantity(order)) {
      for (const item of order.orderShipOutDetails) {
        this.inventories.set(item.productVariantId, this.inventories.get(item.productVariantId) + item.quantity);
        orderQuantities.find(x => x.productVariantId === item.productVariantId).quantity = 0;
      }
      order.choices[this.index] = false;
    }
    else { // 부족상품을 반환된 인벤토리로 
      for (const item of order.orderShipOutDetails) {
        this.inventories.set(item.productVariantId, this.inventories.get(item.productVariantId) - item.quantity);
        orderQuantities.find(x => x.productVariantId === item.productVariantId).quantity = item.quantity;
      }
    }
  }

  switchIconVisible(order: OrderShipOut): boolean {
    return !this.isEntireItemsQuantityOk(order) && this.getInventorySwitchIconName(order) !== '';
  }

  getInventorySwitchTooltip(order: OrderShipOut): string {
    // 정상 할당된 상품
    if (!this.isShortOrderQuantity(order)) {
      return this.translator.get('common.message.cancelOrderShipOutInventory');
    }

    // 부족한 상품은 정상 할당에서 제거된 인벤토리 수량이 있는지 체크 후
    // 재고가 있으면 추가할수 있는 메시지 표시
    if (this.hasAllItemsQuantity(order)) {
      return this.translator.get('common.message.assignOrderShipOutInventory');
    }

    return '';
  }

  getInventorySwitchIconName(order: OrderShipOut): string {
    // 정상 할당된 상품은 제거 아이콘 표시
    if (!this.isShortOrderQuantity(order)) {
      return 'remove_circle_outline';
    }

    // 부족한 상품은 정상 할당에서 제거된 인벤토리 수량이 있는지 체크 후
    // 재고가 있으면 추가할수 있는 아이콘 표시
    if (this.hasAllItemsQuantity(order)) {
      return 'add_circle_outline';
    }

    return '';
  }

  hasAllItemsQuantity(order: OrderShipOut): boolean {
    return order.orderShipOutDetails.every(item => this.hasQuantity(item.productVariantId, item.quantity));
  }

  hasQuantity(productVariantId: number, requiredQuantity: number): boolean {
    const currentQuantity = this.inventories.get(productVariantId);

    if (!currentQuantity) {
      return false;
    }

    return currentQuantity - requiredQuantity >= 0;
  }

  getOrderCount(order: OrderShipOut): string {
    return this.commaNumber(order.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + b));
  }

  buttonListOrders(confirmedConfirmMessages: Set<string> = new Set<string>()) {
    const uncombinedOrderChecker = new Map<string, number>();
    this.selectedOrders.filter(x => x.dupAddressName != null && x.combinedShipAddressName == null).forEach(order => {
      if (!uncombinedOrderChecker.has(order.dupAddressName)) {
        uncombinedOrderChecker.set(order.dupAddressName, 1);
      }
      else {
        uncombinedOrderChecker.set(order.dupAddressName, uncombinedOrderChecker.get(order.dupAddressName) + 1);
      }
    });

    const uncombinedOrderExists = Array.from(uncombinedOrderChecker.values()).some(x => x > 1);

    let confirmMessage = null;
    // 합배송처리 안하고 그냥 출고하는 거라면 컨펌 받는다.
    if (uncombinedOrderExists) {
      confirmMessage = this.translator.get('sales.pendingOrderShipOutList.confirmCombinedShipExists');
      if (confirmedConfirmMessages.has(confirmMessage)) { confirmMessage = null; }
    }

    if (!confirmMessage) {
      const customsIssues = this.selectedOrders.filter(order => this.getShipOutStatusIcons(order).length > 0);
      if (customsIssues.length > 0) {
        confirmMessage = String.Format(
          this.translator.get('sales.pendingOrderShipOutList.confirmCustomsIssueExists'),
          customsIssues[0].orderFk.marketOrderNumber,
          customsIssues[0].deliveryTagFk.consigneeName,
          customsIssues.length === 1 ? '' :
            String.Format(this.translator.get('sales.pendingOrderShipOutList.extraDataCount'), customsIssues.length - 1)
        );
        if (confirmedConfirmMessages.has(confirmMessage)) { confirmMessage = null; }
      }
    }

    // 아무런 User Confirm 메시지가 없다면 기본 확인 메시지를 설정
    if (!confirmMessage) {
      confirmMessage = this.translator.get('common.message.areYouSure');
    }

    if (confirmedConfirmMessages.has(confirmMessage)) {
      this.listOrders();
    }
    else {
      // 최종 컨펌
      this.alertService.showDialog(
        this.translator.get('common.title.yesOrNo'),
        confirmMessage,
        DialogType.confirm,
        () => {
          confirmedConfirmMessages.add(confirmMessage);
          this.buttonListOrders(confirmedConfirmMessages);
        },
        () => null,
        this.translator.get('common.button.yes'),
        this.translator.get('common.button.no')
      );      
    }
  }

  /**
   * HS CODE 편집 작업대상 데이터가 있으면 일괄 편집창을 팝업
   * @returns false if HS CODE entries 
   */
  private checkHsCodeEntries(): boolean {
    // HS CODE 입력 안한 내용이 있는지 검사한다.
    const hsCodeEntryProducts = new Map<number, ProductHsCode>();
    for (const order of this.selectedOrders) {
      // 같은 국가면 HS Code입력 불필요.
      if (this.isSameCountry(this.warehouse, order)) { continue; }

      for (const item of order.orderShipOutDetails) {
        if (!hsCodeEntryProducts.has(item.productId) && !item.hsCode) {
          hsCodeEntryProducts.set(item.productId, { id: item.productId, name: item.name });
        }
      }
    }

    // 미입력 HS Code가 있으면 일괄 입력창을 팝업
    if (hsCodeEntryProducts.size > 0) {
      this.alertService.showDialog(
        this.translator.get('common.title.confirm'),
        String.Format(this.translator.get('sales.pendingOrderShipOutList.confirmNeedHsCodeEntry'), hsCodeEntryProducts.size),
        DialogType.confirm,
        () => this.openHsCodeEditor(Array.from(hsCodeEntryProducts.values())),
        () => null,
        this.translator.get('common.button.yes'),
        this.translator.get('common.button.no')
      );
      return false;
    }

    return true;
  }

  /**
   * Opens HS CODE editor
   * @param products ProductHsCode[]
   */
  openHsCodeEditor(products: ProductHsCode[]) {
    const setting = new OliveDialogSetting(
      OliveProductHsCodesEditorComponent,
      {
        item: products,
        itemType: ProductHsCode,
        customTitle: this.translator.get('sales.pendingOrderShipOutList.productHsCodeEditorTitle'),
        hideDelete: true
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe((results: ProductHsCode[]) => {
      if (results) {
        // 관련 HS Code를 모두 업데이트 한다.
        for (const order of this.allOrders) {
          for (const item of order.orderShipOutDetails) {
            const source = results.find(x => x.id === item.productId);
            if (source) {
              item.hsCode = source.hsCode;
            }
          }
        }

        // 리스팅을 다시한다.
        this.listOrders();
      }
    });
  }

  /**
   * 국가 그룹 CustomsRule을 만든다.
   * @param countryIds 
   * @returns country rules 
   */
  private getCountryCustomsRules(countryIds: Set<number>): Map<string, any> {
    const configs = new Map<string, any>();

    // 입력타입코드 정의
    let key = (OliveConstants.customsRule.typeCodes).toUpperCase();
    configs.set(key, this.customsConfigs.get(key));

    for (const countryId of Array.from(countryIds.keys())) {
      // 국가 ID를 국가 코드로 변환
      const countryCode = this.countries.get(countryId).code;

      // 해당 국가코드 통관규칙
      key = (OliveConstants.customsRule.ruleCountryCode + countryCode).toUpperCase();
      configs.set(key, this.customsConfigs.get(key));
    }

    return configs;
  }

  /**
   * CustomsTypeCode 편집 작업대상 데이터가 있으면 일괄 편집창을 팝업
   * @param [selectedOrderOnly] 선택주문 / 전체 주문 대상여부
   * @returns false if customs type code entries 
   */
  private checkCustomsTypeCodeEntries(selectedOrderOnly: boolean = true): boolean {
    // 제품별로 어떤 국가로 출고되는지 조사
    const productCountries = new Map<number, Set<number>>();

    const orders = selectedOrderOnly ? this.selectedOrders : this.allOrders;

    for (const order of orders) {
      // 같은 국가면 통관 타입 입력 불필요
      if (this.isSameCountry(this.warehouse, order)) { continue; }

      const countryId = order.deliveryAddressFk.countryId;

      for (const item of order.orderShipOutDetails) {
        if (!productCountries.has(item.productId)) {
          productCountries.set(item.productId, new Set([countryId]));
        }

        const countryIds = productCountries.get(item.productId);

        if (!countryIds.has(countryId)) {
          countryIds.add(countryId);
        }
      }
    }

    // 국가 그룹별 CustomsRule을 만든다.
    const customsRulesByCountryGroup = new Map<string, Map<string, any>>();
    for (const countryIds of Array.from(productCountries.values())) {
      const key = Array.from(countryIds.keys()).join();
      if (!customsRulesByCountryGroup.has(key)) {
        customsRulesByCountryGroup.set(key, this.getCountryCustomsRules(countryIds));
      }
    }

    // 미입력 Customs Type Code가 있는지 검사한다.
    const typeCodeEntryProducts = new Map<number, ProductCustomsTypeCode>();
    const validatedProductIds = new Set<number>();
    for (const order of orders) {
      // 같은 국가면 통관 타입 입력 불필요
      if (this.isSameCountry(this.warehouse, order)) { continue; }

      for (const item of order.orderShipOutDetails) {
        if (typeCodeEntryProducts.has(item.productId) || validatedProductIds.has(item.productId)) { continue; }

        const customsRules = customsRulesByCountryGroup.get(
          Array.from(productCountries.get(item.productId).keys()).join());

        const error = isCustomsTypeCodeError(item.customsTypeCode, customsRules, true);

        // 데이터가 유효하지 않다면 입력을 받는다.        
        if (error) {
          typeCodeEntryProducts.set(
            item.productId,
            {
              id: item.productId,
              name: item.name,
              customsTypeCode: item.customsTypeCode,
              customsRules: customsRules
            });
        }

        validatedProductIds.add(item.productId);
      }
    }

    // 미입력 Customs Type Code가 있으면 일괄 입력창을 팝업
    if (typeCodeEntryProducts.size > 0) {
      if (selectedOrderOnly) {
        this.alertService.showDialog(
          this.translator.get('common.title.confirm'),
          String.Format(this.translator.get('sales.pendingOrderShipOutList.confirmNeedCustomsTypeCodeEntry'), typeCodeEntryProducts.size),
          DialogType.confirm,
          () => this.openCustomsTypeCodeEditor(Array.from(typeCodeEntryProducts.values())),
          () => null,
          this.translator.get('common.button.yes'),
          this.translator.get('common.button.no')
        );
      }
      else {
        this.openCustomsTypeCodeEditor(Array.from(typeCodeEntryProducts.values()), false);
      }

      return false;
    }

    return true;
  }

  /**
   * Opens CustomsTypeCode editor
   * @param products ProductCustomsTypeCode[]
   */
  openCustomsTypeCodeEditor(products: ProductCustomsTypeCode[], callListOrderWhenFinished = true) {
    const customsTypeCodes = products[0].customsRules.get(OliveConstants.customsRule.typeCodes.toUpperCase()) as string[];

    const setting = new OliveDialogSetting(
      OliveProductCustomsTypeCodesEditorComponent,
      {
        item: products,
        itemType: ProductCustomsTypeCode,
        customTitle: String.Format(this.translator.get('sales.pendingOrderShipOutList.productCustomsTypeCodeEditorTitle'), customsTypeCodes.join()),
        hideDelete: true,
        extraParameter: null
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe((results: ProductCustomsTypeCode[]) => {
      if (results) {
        // 관련 HS Code를 모두 업데이트 한다.
        for (const order of this.allOrders) {
          for (const item of order.orderShipOutDetails) {
            const source = results.find(x => x.id === item.productId);
            if (source) {
              item.customsTypeCode = source.customsTypeCode;
            }
          }
        }

        // 리스팅을 다시한다.
        if (callListOrderWhenFinished) {
          this.listOrders();
        }
      }
    });
  }

  /**
   * 백앤드에 출고 요청
   * @returns  
   */
  private listOrders() {

    if (!this.checkHsCodeEntries()) {
      return;
    }

    if (!this.checkCustomsTypeCodeEntries()) {
      return;
    }

    const newPackagesRequest = [];

    for (const order of this.selectedOrders) {
      const dupAddressName = this.getTailedDupAddressName(order);
      newPackagesRequest.push({
        orderShipOutId: order.id,
        warehouseId: this.warehouse.id,
        combinedShipAddressName: this.isPendingCombinedDupAddressName(dupAddressName) ? '' : dupAddressName,
        primary: order.combinedShipAddressIsPrimary
      });
    }

    this.setIsLoading(true);

    this.orderShipOutPackageService.newItem(newPackagesRequest).subscribe(
      response => {
        this.setIsLoading(false);
        this.onShipOutFinished(response);
      },
      error => {
        this.setIsLoading(false);
        this.alertService.stopLoadingMessage();

        // 다른 User가 이미 출고를 했거나 주문취소를 했을 경우 출고 대상 데이터가 없다.
        // 이경우 Refresh를 해서 모든 작업을 초기화 해야 한다.
        if (error.error && error.error.errorCode === OliveBackEndErrors.DataNotExistsError) {
          this.showRefreshDialog(this.translator.get('sales.pendingOrderShipOutList.orderShipOutDataNotExistsErrorMessage'));
        }
        else {
          this.messageHelper.showStickySaveFailed(error, false);
        }
      }
    );
  }

  /**
   * Determines whether same country is
   * @param warehouse 
   * @param order 
   * @returns  
   */
  private isSameCountry(warehouse: Warehouse, order: OrderShipOut) {
    return warehouse.companyMasterBranchFk.addressFk.countryId === order.deliveryAddressFk.countryId;
  }

  private showRefreshDialog(message: string, title: string = null) {
    this.alertService.showDialog
      (
        title ? title : this.translator.get('common.title.errorConfirm'),
        message,
        DialogType.alert,
        () => this.reload.emit(),
        null,
        this.translator.get('common.button.refresh')
      );
  }

  private onShipOutFinished(response: any) {
    this.shipOutFinished.emit(response.model);

    const shortInventoryOrderIdsString = response.message as string;

    let shortInventoryOrderIds: number[];
    if (shortInventoryOrderIdsString) {
      shortInventoryOrderIds = shortInventoryOrderIdsString.split(',').map(Number);
    }

    // 패키지/재고전환 누락건이 있을 경우 사용자에게 알린 후 Reload한다.
    if (shortInventoryOrderIds && shortInventoryOrderIds.length > 0) {
      this.showRefreshDialog(String.Format(this.translator.get('common.message.outOfStock'), shortInventoryOrderIds.length));
    }
    else { // 재고가 저장된것 빼고 삭제한다.
      for (let i = this.allOrders.length - 1; i >= 0; i--) {
        const orderId = this.allOrders[i].id;
        if (this.allOrders[i].choices[this.index] && (!shortInventoryOrderIds || shortInventoryOrderIds.every(x => x !== orderId))) {
          this.ordersQuantities.delete(orderId);
          this.allOrders.splice(i, 1);
        }
      }
    }

    this.selectedAll = false;
  }

  /**
   * Gets avail carrier trackings numbers groups
   */
  get availCarrierTrackingsNumbersGroups(): CarrierTrackingNumbersGroup[] {
    return this.carrierTrackingNumbersGroups.filter(x =>
      x.branchId === this.warehouse.companyMasterBranchId ||
      x.companyGroupId === this.queryParams.CompanyGroupId ||
      !x.branchId || !x.companyGroupId);
  }

  buttonFilterHasShipOutProblems() {
    this.filterHasShipOutProblems = true;
    this.filterOrders();
  }

  buttonFilterHasOkShipOuts() {
    this.filterHasShipOutProblems = false;
    this.filterOrders();
  }

  buttonFilterCombinedOrders() {
    this.filterCombinedShipping = true;
    this.filterOrders();
  }

  buttonFilterShortItemsOrders() {
    this.filterShortItems = true;
    this.filterOrders();
  }

  buttonFilterCustomsIssuesOrders() {
    this.filterCustomsIssues = true;
    this.filterOrders();    
  }

  buttonRemoveFilters() {
    this.filterHasShipOutProblems = null;
    this.filterCombinedShipping = null;
    this.filterShortItems = null;
    this.filterCustomsIssues = null;
    this.filterKeyword = '';
    this.filteredOrders = null;
  }

  get removeFilterTitle() {
    let filterName = '';

    if (this.filterHasShipOutProblems) {
      filterName = this.translator.get('common.menu.filterHasShipOutProblems');
    }
    else if (this.filterHasShipOutProblems === false) {
      filterName = this.translator.get('common.menu.filterHasOkShipOuts');
    }
    else if (this.filterCombinedShipping) {
      filterName = this.translator.get('common.menu.filterCombinedOrders');
    }
    else if (this.filterShortItems) {
      filterName = this.translator.get('common.menu.filterShortItemOrders');
    }
    else if (this.filterCustomsIssues) {
      filterName = this.translator.get('common.menu.filterCustomsIssuesOrders');
    }

    if (this.filterKeyword.length > 0) {
      const keywordTitle = this.translator.get('common.word.keyword');
      if (filterName) {
        filterName = `${filterName}+${keywordTitle}`;
      }
      else {
        filterName = keywordTitle;
      }
    }

    const filterButtonName = this.translator.get('common.button.removeFilter');

    return `${filterButtonName} (${filterName})`;
  }

  /**
   * 선송장 발급 버튼 처리
   */
  buttonPreAssignTrackingNumbers(carrierTrackingsNumbersGroupsId: number = null, 
    preSelectedOrders: OrderShipOut[] = null, callExportForTrackingNumberUpdate = false) {

    let targetOrders: OrderShipOut[];

    if (preSelectedOrders) {
      targetOrders = preSelectedOrders;
    }
    else if (this.selectedOrders.length === 0) {
      // 모두 이미 송장발급이 되었다면 작업대상이 없다고 오류메시지 표시
      if (this.allOrders.every(x => !this.isNull(x.trackingNumber))) {
        this.messageHelper.showError(this.translator.get('sales.pendingOrderShipOutList.allOrderHaveTrackingNumbers'));
      }
      else {
        this.alertService.showDialog(
          this.translator.get('common.title.errorConfirm'),
          this.translator.get('sales.pendingOrderShipOutList.confirmIssueOnlyNoTrackingOrders'),
          DialogType.confirm,
          () => {
            this.buttonPreAssignTrackingNumbers(
              carrierTrackingsNumbersGroupsId, 
              this.allOrders.filter(x => this.isNull(x.trackingNumber)),
              callExportForTrackingNumberUpdate
            );
          },
          () => null,
          this.translator.get('common.button.yes'),
          this.translator.get('common.button.no')
        );
      }
      return;
    }
    else {
      targetOrders = this.selectedOrders;
    }

    const availCarrierTrackingsNumbersGroups = this.availCarrierTrackingsNumbersGroups;

    // 선발급 송장번호대가 없을 경우 
    if (availCarrierTrackingsNumbersGroups.length === 0) {
      this.orderShipOutHelperService.notifyNotEnoughCarrierTrackingsNumbersGroups(
        this.translator.get('sales.pendingOrderShipOutList.confirmNoCarrierTrackingNumbersGroupsMessage')
      );
      return;
    }

    // 송장번호대가 멀티일 경우 선택하게 한다.
    if (!carrierTrackingsNumbersGroupsId && availCarrierTrackingsNumbersGroups.length > 1) {
      const dialogRef = this.orderShipOutHelperService.popUpSelectCarrierTrackingsNumbersGroupsDialog(availCarrierTrackingsNumbersGroups);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          carrierTrackingsNumbersGroupsId = result;
          this.buttonPreAssignTrackingNumbers(carrierTrackingsNumbersGroupsId, targetOrders, callExportForTrackingNumberUpdate);
        }
      });      
      return;
    }

    let carrierTrackingsNumbersGroup = availCarrierTrackingsNumbersGroups[0];

    if (carrierTrackingsNumbersGroupsId) {
      carrierTrackingsNumbersGroup = availCarrierTrackingsNumbersGroups.find(x => x.id === carrierTrackingsNumbersGroupsId);
    }

    // 기존 송장번호가 발급된 주문이 존재할 경우 작업을 진행할지 확인
    if (targetOrders.find(x => !this.isNull(x.trackingNumber))) {
      this.confirmFoundPreAssignedCarrierTrackingNumber(carrierTrackingsNumbersGroup, targetOrders);
      return;
    }

    // 송장번호 발급
    this.orderShipOutHelperService.preAssignTrackingNumbers(carrierTrackingsNumbersGroup, targetOrders);

    if (callExportForTrackingNumberUpdate) {
      return this.exportForTrackingNumberUpdate();
    }
  }

  /**
   * 기존 송장번호가 발급된 주문이 존재할 경우 작업을 진행할지 확인
   */
  confirmFoundPreAssignedCarrierTrackingNumber(carrierTrackingsNumbersGroup: CarrierTrackingNumbersGroup, targetOrders: OrderShipOut[]) {
    this.alertService.showDialog(
      this.translator.get('common.title.confirm'),
      this.translator.get('sales.pendingOrderShipOutList.confirmFoundPreAssignedCarrierTrackingNumberMessage'),
      DialogType.confirm,
      () => {
        this.orderShipOutHelperService.preAssignTrackingNumbers(carrierTrackingsNumbersGroup, targetOrders);
      },
      () => null,
      this.translator.get('common.button.yes'),
      this.translator.get('common.button.no')
    );
  }

  /**
   * Exports for tracking number update
   */
  exportForTrackingNumberUpdate() {
    // 선송장을 발급하지 않는 대상이 있다면 발급한다.
    if (this.allOrders.some(x => this.isNull(x.trackingNumber))) {
      this.alertService.showDialog(
        this.translator.get('common.title.confirm'),
        this.translator.get('sales.pendingOrderShipOutList.confirmIssueOnlyNoTrackingOrders2'),
        DialogType.confirm,
        () => {
          this.buttonPreAssignTrackingNumbers(
            null, 
            this.allOrders.filter(x => this.isNull(x.trackingNumber)),
            true
          );
        },
        () => null,
        this.translator.get('common.button.yes'),
        this.translator.get('common.button.no')
      );
    }
    else {
      this.orderTrackingExcelService.saveTrackingNumberExcels(this.allOrders);
    }
  }

  /**
   * Exports order list
   */
  exportOrderList() {
    this.documentService.exportHtmlTableToExcel(
      this.translator.get('sales.pendingOrderShipOutList.fileName'),
      this.tableId + '-bottom',
      false,
      null,
      [
        // 재고 열 아이콘 제거
        { appliedIndex: 4, exclusive: true, searchPattern: /-?[A-Z]+[0-9]+/gi },
        // 합배송 열 아이콘 제거
        { appliedIndex: 6, exclusive: true, searchPattern: /[A-Z]+[0-9]?/g }
      ]
    );
  }

  get canPreAssignTrackingNumber(): boolean {
    return true;
  }

  initializeChildComponent() {
  }

  cleanUpChildComponent() {
    this.productCustomsPriceSelectedTrigger.unsubscribe();
    this.productCustomsWeightSelectedTrigger.unsubscribe();
    this.trackingAssignTriggerSubscription.unsubscribe();
  }
}
