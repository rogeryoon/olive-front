import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
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

  // 상품별 부족 수량 정리
  shortInventories = new Map<number, number>();
  inventories = new Map<number, number>();
  // 모든 창고탭에 전역으로 사용됨
  orders: OrderShipOut[] = [];
  // 오더에 매칭한 기대수량과 실제 할당 수량을 저장
  ordersQuantities = new Map<number, AllocatedQuantity[]>();
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  selectedAll: any;

  saveOrder: OrderShipOut;

  @Output() shipOutFinished = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private dialog: MatDialog, private alertService: AlertService,
    private orderShipOutPackageService: OliveOrderShipOutPackageService, 
    private messageHelper: OliveMessageHelperService,
    private productService: OliveProductService, private cacheService: OliveCacheService
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
    for (let index = 0; index < this.orders.length; index++) {
      const order = this.orders[index];

      if (!this.hasShipOutProblems(order)) {
        allDisabled = false;
        break;
      }
    }

    return allDisabled;
  }

  hasShipOutProblems(order: OrderShipOut): boolean {
    return this.isShortOrderQuantity(order) || this.foundNullWeight(order) || this.foundNullCustomsPrice(order);
  }

  get selectedOrders(): OrderShipOut[] {
    return this.orders.filter(x => x.choices[this.index]);
  }

  get canListOrders(): boolean {
    return !this.isNull(this.orders.find(x => x.choices[this.index]));
  }

  get remarkCombinedOrders(): string {
    if (!this.canCombineShip || this.canReleaseCombineShip) { return ''; }

    let totalAmount = 0;

    this.selectedOrders.forEach(order => {
      totalAmount += order.orderShipOutDetails.map(x => x.customsPrice * x.quantity).reduce((a, b) => a + (b || 0), 0);
    });

    return ` (${this.cacheService.showMoney(totalAmount)})`;
  }

  get remarkSelectedOrders(): string {
    const listableCount = this.selectedOrders.length;
    let totalWeight = 0;

    this.selectedOrders.forEach(order => {
      totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);
    });

    return listableCount === 0 ? '' : ` (${this.commaNumber(listableCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  get remarkAllOrders(): string {
    let nullWeightExists = false;
    let totalWeight = 0;

    this.orders.forEach(order => {
      totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);

      if (!nullWeightExists) {
        nullWeightExists = this.foundNullWeight(order);
      }
    });

    const totalRows = this.orders.length;

    return totalRows === 0 ? '' : ` (${this.commaNumber(totalRows)}/${this.commaNumber(totalWeight)}Kg${nullWeightExists ? '-?' : ''})`;
  }

  selectAll() {
    this.orders.forEach(order => {
      order.choices[this.index] = this.selectedAll && !this.isShortOrderQuantity(order);
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.orders.every(x => x.choices[this.index]);
  }

  // 묶음배송 체크 자동선택
  checkSameCombinedShippingGroup(order: OrderShipOut) {
    if (!order.choices[this.index] && order.dupAddressName) {
      this.orders.forEach(item => {
        if (!item.choices[this.index]
          && order.dupAddressName === item.dupAddressName && !this.hasShipOutProblems(item)) {
          item.choices[this.index] = true;
        }
      });
    }
  }

  startTable(orders: OrderShipOut[], inventories: InventoryWarehouse[], parentObject: any, refresh: boolean) {
    this.parentObject = parentObject;

    this.orders = orders;

    this.setWarehouseInventories(inventories);

    this.allocateOrderInventories();

    if (!refresh) {
      this.dtTrigger.next();
    }
  }

  private allocateOrderInventories() {
    for (const order of this.orders) {
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
    return this.getActualQuantity(order) - this.getOrderQuantity(order) !== 0;
  }

  foundNullWeight(order: OrderShipOut): boolean {
    return !this.isNull(order.orderShipOutDetails.find(x => x.kiloGramWeight == null));
  }

  showWeight(order: OrderShipOut): string {
    const weight = order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);

    const foundNullWeight = this.foundNullWeight(order);

    if (weight === 0) {
      return '?';
    }

    return this.numberFormat(weight, 2) + (foundNullWeight ? ' ?' : '');
  }

  showCombinedShipping(order: OrderShipOut): string {
    return order.dupAddressName;
  }

  /**
   * 편집 상품 가져오기
   * @param order OrderShipOut
   * @returns OrderShipOutDetail 
   */
  getEditItem(order: OrderShipOut): OrderShipOutDetail {
    let editItem = order.orderShipOutDetails[0];
    // 아이템이 2개이상일 경우 선택
    if (order.orderShipOutDetails.length > 1) {
      const params: IdName[] = [];

      // 선택창에 보낼 데이터 만들기
      for (const it of order.orderShipOutDetails) {
        const weightString = it.kiloGramWeight ? this.numberFormat(it.kiloGramWeight, 2) : '?';
        params.push({id: it.productVariantId, name: `[${weightString}Kg]-${it.name}`});  
      }

      const dialogRef = this.dialog.open(
        OliveSelectOneDialogComponent,
        {
          disableClose: false,
          panelClass: 'mat-dialog-md',
          data: {
            title: this.translator.get('sales.pendingOrderShipOutList.selectProductForWeightTitle'),
            description: this.translator.get('sales.pendingOrderShipOutList.selectProductForWeightDescription'),
            items: params
          } as OliveSelectOneSetting
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          editItem = order.orderShipOutDetails.find(x => x.productVariantId === result);
        }
      });
    }

    return editItem;
  }

  /**
   * 상품 무게 수정
   * @param order OrderShipOut
   */
  editItemsWeight(order: OrderShipOut) {
    const editItem = this.getEditItem(order);

    // 백앤드에서 상품무게 받음
    this.productService.get(`weight/${editItem.productVariantId}/`).subscribe(
      response => this.updateProductWeight(order, response.model),
      error => this.messageHelper.showLoadFailedSticky(error)
    );    
  }

  /**
   * Updates product weight
   * @param order OrderShipOut
   * @param weight ProductWeight
   */
  private updateProductWeight(order: OrderShipOut, weight: ProductWeight) {
    // 상품 무게 수정창 오픈
    const setting = new OliveDialogSetting(
      OliveProductWeightEditorComponent,
      {
        item: {
          productVariantId: weight.productVariantId,
          productGroupWeight: weight.productGroupWeight, 
          productGroupWeightTypeCode: weight.productGroupWeightTypeCode,
          productVariantWeight: weight.productVariantWeight,
          productVariantWeightTypeCode: weight.productVariantWeightTypeCode
        } as ProductWeight,
        itemType: OrderShipOut,
        customTitle: `${order.orderFk.marketSellerFk.code} - ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
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

    // 무게 업데이트
    dialogRef.afterClosed().subscribe(kilo => {
      if (kilo) {
        for (const od of this.orders) {
          for (const it of od.orderShipOutDetails.filter(x => x.productVariantId === weight.productVariantId)) {
            it.kiloGramWeight = kilo;
          }
        }
      }
    });
  }

  /**
   * 세관신고 상품 금액 수정
   * @param order OrderShipOut
   */
  editCustomsPrice(order: OrderShipOut) {
    const editItem = this.getEditItem(order);

    // 백앤드에서 상품무게 받음
    this.productService.get(`customsPrice/${editItem.productVariantId}/`).subscribe(
      response => this.updateCustomsPrice(order, response.model),
      error => this.messageHelper.showLoadFailedSticky(error)
    );
  }

  /**
   * Updates product customs price on
   * @param order OrderShipOut
   * @param price ProductCustomsPrice
   */
  private updateCustomsPrice(order: OrderShipOut, price: ProductCustomsPrice) {
    // 세관신고 상품가격 수정창 오픈
    const setting = new OliveDialogSetting(
      OliveProductCustomsPriceEditorComponent,
      {
        item: {
          productVariantId: price.productVariantId,
          productGroupCustomsPrice: price.productGroupCustomsPrice, 
          productVariantCustomsPrice: price.productVariantCustomsPrice
        } as ProductCustomsPrice,
        itemType: OrderShipOut,
        customTitle: `${order.orderFk.marketSellerFk.code} - ${order.orderFk.marketOrdererName} (${this.getOrderCount(order)})`,
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

    // 가격 업데이트
    dialogRef.afterClosed().subscribe(customsPrice => {
      if (customsPrice) {
        for (const od of this.orders) {
          for (const it of od.orderShipOutDetails.filter(x => x.productVariantId === price.productVariantId)) {
            it.customsPrice = customsPrice;
          }
        }
      }
    });
  }

  showCustomsPrice(order: OrderShipOut): string {
    const price = order.orderShipOutDetails.map(x => x.customsPrice * x.quantity).reduce((a, b) => a + (b || 0), 0);

    const foundNullCustomsPrice = this.foundNullCustomsPrice(order);

    if (price === 0) {
      return '?';
    }

    return this.cacheService.showMoney(price) + (foundNullCustomsPrice ? ' ?' : '');
  }

  foundNullCustomsPrice(order: OrderShipOut): boolean {
    return !this.isNull(order.orderShipOutDetails.find(x => x.customsPrice == null));
  }

  combineShip() {
    const canCombineShip = this.canCombineShip;
    if (!(canCombineShip || this.canReleaseCombineShip)) { return; }

    const combines = this.selectedOrders;

    if (!canCombineShip) {
      combines.forEach(order => {
        order.combinedShipAddressName = null;
        order.combinedShipDeliveryInfoSelected = false;
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
            items: items
          } as OliveSelectOneSetting
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateCombinedShippingInfos(result);
        }
      });
    }
    else {
      this.updateCombinedShippingInfos(combines[0].id);
    }
  }

  private updateCombinedShippingInfos(combinedShipDeliveryInfoSelectedOrderId: number) {
    this.selectedOrders.forEach(order => {
      order.combinedShipAddressName = order.dupAddressName;
      if (order.id === combinedShipDeliveryInfoSelectedOrderId) {
        order.combinedShipDeliveryInfoSelected = true;
      }
    });

    this.unCheckSelectedOrders();
  }

  private unCheckSelectedOrders() {
    this.selectedOrders.forEach(order => {
      order.choices[this.index] = false;
    });
  }

  editOrder(order: OrderShipOut) {
    this.saveOrder = order;
    const setting = new OliveDialogSetting(
      OliveOrderShipOutManagerComponent,
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

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        const backup = _.cloneDeep(this.saveOrder);
        Object.assign(this.saveOrder, item);

        this.saveOrder.choices = _.cloneDeep(backup.choices);
        this.saveOrder.dupAddressName = backup.dupAddressName;
        this.saveOrder.combinedShipAddressName = backup.combinedShipAddressName;
        this.saveOrder.combinedShipDeliveryInfoSelected = backup.combinedShipDeliveryInfoSelected;
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

  buttonListOrders() {
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

    let confirmMessage = this.translator.get('common.message.areYouSure');
    // 합배송처리 안하고 그냥 출고하는 거라면 컨펌 받는다.
    if (uncombinedOrderExists) {
      confirmMessage = this.translator.get('sales.pendingOrderShipOutList.confirmCombinedShipExists');
    }

    this.alertService.showDialog(
      this.translator.get('common.title.yesOrNo'),
      confirmMessage,
      DialogType.confirm,
      () => this.listOrders(),
      () => null,
      this.translator.get('common.button.yes'),
      this.translator.get('common.button.no')
    );
  }

  private listOrders() {
    this.setIsLoading(true);

    const newPackagesRequest = [];

    this.selectedOrders.forEach(order => {
      newPackagesRequest.push({
        orderShipOutId: order.id,
        warehouseId: this.warehouse.id,
        combinedShipAddressName: order.combinedShipAddressName,
        primary: order.combinedShipDeliveryInfoSelected
      });
    });

    this.orderShipOutPackageService.newItem(newPackagesRequest).subscribe(
      response => {
        this.setIsLoading(false);
        this.onShipOutFinished(response);
      },
      error => {
        this.setIsLoading(false);
        this.messageHelper.showStickySaveFailed(error, false);
      }
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
      this.alertService.showDialog
        (
          this.translator.get('common.title.errorConfirm'),
          String.Format(this.translator.get('common.message.outOfStock'), shortInventoryOrderIds.length),
          DialogType.alert,
          () => this.reload.emit(),
          null,
          this.translator.get('common.button.refresh')
        );
    }
    else { // 재고가 저장된것 빼고 삭제한다.
      for (let i = this.orders.length - 1; i >= 0; i--) {
        const orderId = this.orders[i].id;
        if (this.orders[i].choices[this.index] && (!shortInventoryOrderIds || shortInventoryOrderIds.every(x => x !== orderId))) {
          this.ordersQuantities.delete(orderId);
          this.orders.splice(i, 1);
        }
      }
    }

    this.selectedAll = false;
  }

  // TODO : buttonPreAssignTrackingNumber
  buttonPreAssignTrackingNumber() {
    console.log('buttonPreAssignTrackingNumber');
  }

  // TODO : exportForTrackingNumberUpdate
  exportForTrackingNumberUpdate() {
    console.log('exportForTrackingNumberUpdate');
  }

  get canPreAssignTrackingNumber(): boolean {
    return true;
  }

  initializeChildComponent() {
    this.dtOptions = {
      paging: false,
      ordering: false,
      dom: ''
    };
  }

  cleanUpChildComponent() {
    this.dtTrigger.unsubscribe();
  }
}

