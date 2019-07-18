import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService, DialogType } from '@quick/services/alert.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { InventoryWarehouse } from 'app/main/productions/models/inventory-warehouse';
import { OliveSelectOneDialogComponent } from 'app/core/components/dialogs/select-one-dialog/select-one-dialog.component';
import { OliveSelectOneSetting } from 'app/core/interfaces/dialog-setting/select-one-setting';
import { IdName } from 'app/core/models/id-name';
import { OliveOrderShipOutPackageService } from 'app/main/sales/services/order-ship-out-package.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveOnShare } from 'app/core/interfaces/on-share';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import * as _ from 'lodash';
import { OliveOrderShipOutManagerComponent } from '../../order-ship-out/order-ship-out-manager/order-ship-out-manager.component';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';

class OrderQuantity {
  productVariantId: number;
  expectedQuantity: number;
  allocatedQuantity: number;
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
  orderQuantities = new Map<number, OrderQuantity[]>();

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  selectedAll: any;

  saveOrder: OrderShipOut;

  @Output() shipOutFinished = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private dialog: MatDialog, private alertService: AlertService,
    private orderShipOutPackageService: OliveOrderShipOutPackageService, private messageHelper: OliveMessageHelperService
  ) {
    super(
      formBuilder, translater
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

  get allCheckboxesDisalbed(): boolean {
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
    return this.isShortOrderQuantity(order) || this.foundNullWeight(order);
  }

  get selectedOrders(): OrderShipOut[] {
    return this.orders.filter(x => x.selecteds[this.index]);
  }

  get canListOrders(): boolean {
    return !OliveUtilities.testIsUndefined(this.orders.find(x => x.selecteds[this.index]));
  }

  get remarkSelectedOrders(): string {
    const listableCount = this.selectedOrders.length;
    let totalWeight = 0;

    this.selectedOrders.forEach(order => {
      totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight).reduce((a, b) => a + (b || 0), 0);
    });

    return listableCount === 0 ? '' : ` (${this.commaNumber(listableCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  get remarkAllOrders(): string {
    let nullWeightExists = false;
    let totalWeight = 0;

    this.orders.forEach(order => {
      totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight).reduce((a, b) => a + (b || 0), 0);

      if (!nullWeightExists) {
        nullWeightExists = this.foundNullWeight(order);
      }
    });

    const totalRows = this.orders.length;

    return totalRows === 0 ? '' : ` (${this.commaNumber(totalRows)}/${this.commaNumber(totalWeight)}Kg${nullWeightExists ? '-?' : ''})`;
  }

  selectAll() {
    this.orders.forEach(order => {
      order.selecteds[this.index] = this.selectedAll && !this.isShortOrderQuantity(order);
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.orders.every(x => x.selecteds[this.index]);
  }

  // 묶음배송 체크 자동선택
  checkSameCombinedShippingGroup(order: OrderShipOut) {
    if (!order.selecteds[this.index] && order.dupAddressName) {
      this.orders.forEach(item => {
        if (!item.selecteds[this.index] 
          && order.dupAddressName === item.dupAddressName && !this.hasShipOutProblems(item)) {
          item.selecteds[this.index] = true;
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
    this.orders.forEach(order => {
      const orderQuantities: OrderQuantity[] = [];

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
          expectedQuantity: item.quantity,
          allocatedQuantity: allocatedQuantity
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

      this.orderQuantities.set(order.id, orderQuantities);
    });
  }

  private setWarehouseInventories(inventories: InventoryWarehouse[]) {

    inventories.forEach(item => {
      const founded = item.inventories.find(x => x.id === this.warehouse.id);
      if (founded) {
        this.inventories.set(item.id, founded.value);
        return;
      }
    });
  }

  showInventory(order: OrderShipOut): string {
    return `${this.getAllocatedQuantity(order)} / ${this.getExpectedOrderQuantity(order)}`;
  }

  showShortage(order: OrderShipOut): string {
    if (this.isShortOrderQuantity(order)) {
      const shortageItemStrings: string[] = [];
      this.orderQuantities.get(order.id)
        .filter(x => x.allocatedQuantity - x.expectedQuantity !== 0)
        .forEach(quantity => {
          const itemName = order.orderShipOutDetails.find(x => x.productVariantId === quantity.productVariantId).name;
          shortageItemStrings.push(`${itemName} (${quantity.expectedQuantity - quantity.allocatedQuantity})`);
        });

      return shortageItemStrings.join();
    }
    return '';
  }

  getExpectedOrderQuantity(order: OrderShipOut): number {
    return this.orderQuantities.get(order.id).map(x => x.expectedQuantity).reduce((a, b) => a + b);
  }

  getAllocatedQuantity(order: OrderShipOut): number {
    return this.orderQuantities.get(order.id).map(x => x.allocatedQuantity).reduce((a, b) => a + b);
  }

  isShortOrderQuantity(order: OrderShipOut): boolean {
    return this.getAllocatedQuantity(order) - this.getExpectedOrderQuantity(order) !== 0;
  }

  foundNullWeight(order: OrderShipOut): boolean {
    return !OliveUtilities.testIsUndefined(order.orderShipOutDetails.find(x => x.kiloGramWeight == null));
  }

  showWeight(order: OrderShipOut): string {
    const weight = order.orderShipOutDetails.map(x => x.kiloGramWeight).reduce((a, b) => a + (b || 0), 0);

    const foundNullWeight = this.foundNullWeight(order);

    if (weight === 0) {
      return '?';
    }

    return OliveUtilities.numberFormat(weight, 2) + (foundNullWeight ? ' ?' : '');
  }

  showCombinedShipping(order: OrderShipOut): string {
    return order.dupAddressName;
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
      this.uncheckSelectedOrders();
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
            title: this.translater.get('sales.pendingOrderShipOutList.selectDeliveryInfoTitle'),
            description: this.translater.get('sales.pendingOrderShipOutList.selectDeliveryInfoDescription'),
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

    this.uncheckSelectedOrders();
  }

  private uncheckSelectedOrders() {
    this.selectedOrders.forEach(order => {
      order.selecteds[this.index] = false;
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

        this.saveOrder.selecteds = _.cloneDeep(backup.selecteds);
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

    console.log('switchInventory');
    
    // 정상 할당된 상품은 인벤토리로 반환
    if (!this.isShortOrderQuantity(order)) {
      for (const item of order.orderShipOutDetails) {
        this.inventories.set(item.productVariantId, this.inventories.get(item.productVariantId) + item.quantity);

      }
    }
    else { // 부족상품을 반환된 인벤토리로 

    }
  }

  switchIconVisible(order: OrderShipOut): boolean {
    return !this.isEntireItemsQuantityOk(order) && this.getInventorySwitchIconName(order) !== '';
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

    let confirmMessage = this.translater.get('common.message.areYouSure');
    // 합배송처리 안하고 그냥 출고하는 거라면 컨펌 받는다.
    if (uncombinedOrderExists) {
      confirmMessage = this.translater.get('sales.pendingOrderShipOutList.confirmCombinedShipExists');
    }

    this.alertService.showDialog(
      this.translater.get('common.title.yesOrNo'),
      confirmMessage,
      DialogType.confirm,
      () => this.listOrders(),
      () => null,
      this.translater.get('common.button.yes'),
      this.translater.get('common.button.no')
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
          this.translater.get('common.title.errorConfirm'),
          String.Format(this.translater.get('common.message.outOfStock'), shortInventoryOrderIds.length),
          DialogType.alert,
          () => this.reload.emit(),
          null,
          this.translater.get('common.button.refresh')
        );
    }
    else { // 재고가 저장된것 빼고 삭제한다.
      for (let i = this.orders.length - 1; i >= 0; i--) {
        const orderId = this.orders[i].id;
        if (this.orders[i].selecteds[this.index] && (!shortInventoryOrderIds || shortInventoryOrderIds.every(x => x !== orderId))) {
          this.orderQuantities.delete(orderId);
          this.orders.splice(i, 1);
        }
      }
    }

    this.selectedAll = false;
  }

  // todo
  buttonPreAssignTrackingNumber() {
    console.log('buttonPreAssignTrackingNumber');
  }

  // todo
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

