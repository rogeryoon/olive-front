import { Component, forwardRef, Output, EventEmitter, Input, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, ControlValueAccessor, Validator } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService } from '@quick/services/alert.service';

import { OliveInWarehouseItemDataSource } from './in-warehouse-item-data-source';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { NameValue } from 'app/core/models/name-value';
import { InWarehouseItem } from '../../../models/in-warehouse-item.model';
import { InWarehouse } from '../../../models/in-warehouse.model';
import { OlivePurchaseOrderLookupDialogComponent } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.component';
import { OlivePurchaseOrderService } from 'app/main/purchasings/services/purchase-order.service';
import { PurchaseOrder } from 'app/main/purchasings/models/purchase-order.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { PurchaseOrderItem } from 'app/main/purchasings/models/purchase-order-item.model';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { isNumberPattern, showParamMessage } from 'app/core/utils/string-helper';
import { createSearchOption } from 'app/core/utils/search-helpers';
import { purchaseOrderId } from 'app/core/utils/olive-helpers';
import { OliveConstants } from 'app/core/classes/constants';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'olive-in-warehouse-items-editor',
  templateUrl: './in-warehouse-items-editor.component.html',
  styleUrls: ['./in-warehouse-items-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveInWarehouseItemsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveInWarehouseItemsEditorComponent),
      multi: true,
    }
  ]
})
export class OliveInWarehouseItemsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator, AfterContentChecked {
  displayedColumns = ['purchaseOrderId26', 'productVariantId26', 'productName', 'balance', 'appliedCost', 'quantityDue', 'quantity', 'remark', 'actions'];
  dataSource: OliveInWarehouseItemDataSource = new OliveInWarehouseItemDataSource(this.cacheService);

  warehouse: Warehouse;
  voidTypeCode: '';
  value: InWarehouseItem[] = null;
  preLoadedPurchaseOrder: PurchaseOrder;

  @Input() isVoidMode = false;

  @Output() requiredWarehouse = new EventEmitter();
  @Output() inWarehouseItemAdded = new EventEmitter();
  @Output() totalItemAmountChanged = new EventEmitter();

  savedItemsAmount: number;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private purchaseOrderService: OlivePurchaseOrderService, private snackBar: MatSnackBar,
    private dialog: MatDialog, private alertService: AlertService,
    private cacheService: OliveCacheService, private messageHelperService: OliveMessageHelperService,
    private cdRef: ChangeDetectorRef
  ) {
    super(
      formBuilder, translator
    );
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;

    if (!this.isVoidMode) {
      this.displayedColumns.splice(1, 0, 'supplier');
    }
  }

  getEditedItem(): InWarehouseItem[] {
    return this.dataSource.items.filter(x => x.quantity > 0);
  }

  /**
   * Gets whether can add or delete items
   * 신규 작성일때만 추가를 허용한다.
   */
  get canAddItems(): boolean {
    return this.isNewItem;
  }

  get balanceHeaderName(): string {
    let name = this.translator.get('purchasing.inWarehouseItems.balance');

    if (this.isVoidMode) {
      if (this.voidTypeCode === OliveConstants.voidPurchaseOrderTypeCode.Return) {
        name = this.translator.get('purchasing.voidPurchaseOrderItems.returnBalanceHeaderName');
      }
      else {
        name = this.translator.get('purchasing.voidPurchaseOrderItems.cancelBalanceHeaderName');
      }
    }

    return name;
  }

  getPurchaseOrderId(item: InWarehouseItem): string {
    return purchaseOrderId(item, 'purchaseOrderDate', 'purchaseOrderShortId');
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({
      formArray: this.oFormArray
    });
    this.dataSource.formGroup = this.oForm;
  }

  resetForm() {
    this.oForm.patchValue({
    });
  }

  setWarehouse(event: any, preLoadedPurchaseOrder: PurchaseOrder = null) {
    this.warehouse = event.item;
    this.voidTypeCode = event.voidTypeCode;
    this.preLoadedPurchaseOrder = preLoadedPurchaseOrder;

    if (event.loading) {
      return;
    }

    let needToClearItems = false;

    if (
      this.isNull(this.warehouse) ||
      this.warehouse.id === this.warehouse.id ||
      this.dataSource.items.length === 0
    ) {
      needToClearItems = true;
    }

    if (needToClearItems) {
      this.clearAllItemsDataSource();

      if (!this.isNull(this.warehouse)) {
        if (this.preLoadedPurchaseOrder) {
          this.buildByPreLoadedPurchaseOrder();
        }
        else
        {
          this.lookupPurchaseOrder();
        }
      }
    }
  }

  clearAllItemsDataSource() {
    this.oFormArray.controls = [];
    this.dataSource.deleteAll();
  }

  createEmptyObject() {
    return new InWarehouse();
  }

  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.name || item.Obj.quantity || item.Obj.appliedCost || item.Obj.remark) {
      this.snackBar.open(
        showParamMessage(this.translator.get('common.message.confirmDelete')),
        this.translator.get('common.button.delete'),
        { duration: 5000 }
      )
        .onAction().subscribe(() => {
          this.deleteUnit(item);
        });
    }
    else {
      this.deleteUnit(item);
    }
  }

  private deleteUnit(item: any) {
    this.dataSource.deleteItem(item);
    if (this.dataSource.items.length === 0) {
      this.oFArray.removeAt(0);
    }

    this._onChange(0);

    this.updateTotalDue();
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.quantity)) {
        quantity += +item.quantity;
      }
    });

    return quantity;
  }

  get totalBalance(): number {
    let balance = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.balance)) {
        balance += +item.balance;
      }
    });

    return balance;
  }

  get totalQuantityDue(): number {
    let due = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.quantity) && !isNaN(item.appliedCost)) {
        due += +item.quantity * +item.appliedCost;
      }
    });

    return due;
  }

  get searchOption(): NameValue[] {
    let option: NameValue[];
    if (this.isVoidMode) {
      option = [{ name: 'VoidPurchaseOrderTypeCode', value: this.voidTypeCode }];
    }
    else {
      option = 
      [
        { name: 'InWarehousePending', value: 'true' }
      ];
    }

    option.push({ name: 'Warehouse', value: this.warehouse.id });

    return option;
  }

  get isReturnMode(): boolean {
    return this.isVoidMode && this.voidTypeCode === OliveConstants.voidPurchaseOrderTypeCode.Return;
  }

  lookupPurchaseOrder() {
    if 
    (
      // 입고모드면서 창고가 선택되지 않았다면 창고 먼저 선택한다.
      (!this.isVoidMode && this.isNull(this.warehouse)) ||
      // 취소모드면서 창고 또는 취소코드가 없을 경우
      (this.isVoidMode && (this.isNull(this.warehouse) || this.voidTypeCode.length === 0))
    ) {
      this.requiredWarehouse.emit();
      return;
    }

    const dialogRef = this.dialog.open(
      OlivePurchaseOrderLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'PurchaseOrder',
          columnType: 'custom',
          itemTitle: `${this.warehouse.name} - ${this.translator.get(NavTranslates.Purchase.list)}`,
          dataService: this.purchaseOrderService,
          maxSelectItems: this.isVoidMode ? 1 : 10,
          itemType: PurchaseOrder,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Purchase.list,
          maxNameLength: 10,
          searchOption:
          createSearchOption(this.searchOption),
          searchPlaceHolderName: 
            this.isReturnMode ? 
            this.translator.get('purchasing.inWarehouseItems.returnSearchPlaceHolderName') :
            this.translator.get('purchasing.inWarehouseItems.searchPlaceHolderName'),
          // 잔여수량 표시
          // 반품 가능 수량 공식
          extra1: this.isReturnMode ? 'quantity - balance - cancelQuantity - returnQuantity' : 'balance',
          // 반품/취소시 취소 타입 코드 설정
          extra2: this.isReturnMode
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pItems => {
      if (!pItems || pItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupPOItemIdCheckSet = new Set();
      let onePurchaseOrderId = 0;

      // 발주서 하나만 선택가능, 이후 추가 버튼을 눌러도 다른 발주서를 로딩 못하게 막음 (VoidMode)
      if (this.dataSource.items.length > 0) {
        onePurchaseOrderId = ((this.dataSource.items[0]) as InWarehouseItem).id;
      }

      if (this.isVoidMode) {
        this.clearAllItemsDataSource();
      }

      this.dataSource.items.forEach((dsItem: InWarehouseItem) => {
        pItems
          .forEach((pItem: PurchaseOrder) => {
            pItem.purchaseOrderItems
              .filter((sItem: PurchaseOrderItem) => 
                dsItem.purchaseOrderItemId === sItem.id || 
                (this.isVoidMode && onePurchaseOrderId !== 0 && onePurchaseOrderId !== pItem.id)
              )
              .forEach((sItem: PurchaseOrderItem) => {
                if (!dupPOItemIdCheckSet.has(sItem.id)) {
                  dupPOItemIdCheckSet.add(sItem.id);
                  duplicatedIdStrings.push(
                    `${this.id26(sItem.id)}: ${sItem.productName}`.trim());
                }
              });
          });
      });

      let needToRender = false;

      let firstAddedPurchaseOrder: PurchaseOrder = null; 

      pItems
        .forEach((pItem: PurchaseOrder) => {
          pItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => 
              (
                ( !this.isReturnMode && sItem.balance > 0 ) ||
                // 반품 가능 수량 공식
                ( this.isReturnMode && sItem.quantity - sItem.balance - sItem.cancelQuantity - sItem.returnQuantity > 0)
              ) && 
              !dupPOItemIdCheckSet.has(sItem.id)
            )
            .forEach((sItem: PurchaseOrderItem) => {
              let quantity = 0;

              if (this.isReturnMode) {
                quantity = sItem.quantity - sItem.balance - sItem.cancelQuantity - sItem.returnQuantity;
              }
              else {
                quantity = sItem.balance;
              }

              if (!firstAddedPurchaseOrder) {
                firstAddedPurchaseOrder = pItem;
              }

              this.dataSource.addNewItem({
                quantity: quantity,
                balance: 0,

                purchaseOrderItemId: sItem.id,
                purchaseOrderShortId: pItem.shortId,

                productName: sItem.productName,
                originalBalance: quantity,
                appliedCost: sItem.appliedCost,
                productVariantId: sItem.productVariantId,
                productVariantShortId: sItem.productVariantShortId,
                supplierName: pItem.supplierFk.name
              } as InWarehouseItem);
              needToRender = true;
            });
        });

      this.renderAfterFetchingPurchaseOrders(firstAddedPurchaseOrder, needToRender);
      this.messageHelperService.showDuplicatedItems(duplicatedIdStrings);
    });
  }

  buildByPreLoadedPurchaseOrder() {
    for (const item of this.preLoadedPurchaseOrder.purchaseOrderItems) {
      this.dataSource.addNewItem({
        quantity: item.balance,
        balance: 0,

        purchaseOrderItemId: item.id,
        purchaseOrderShortId: this.preLoadedPurchaseOrder.shortId,

        productName: item.productName,
        originalBalance: item.balance,
        appliedCost: item.appliedCost,
        productVariantId: item.productVariantId,
        productVariantShortId: item.productVariantShortId,
        supplierName: this.preLoadedPurchaseOrder.supplierFk.name
      } as InWarehouseItem);      
    }

    this.renderAfterFetchingPurchaseOrders(this.preLoadedPurchaseOrder, true);
  }

  renderAfterFetchingPurchaseOrders(firstAddedPurchaseOrder: PurchaseOrder, needToRender: boolean) {
      // For Void Transaction 참조 이벤트
      setTimeout(() => {
        this.inWarehouseItemAdded.emit(firstAddedPurchaseOrder);
      });

      if (needToRender) {
        this.dataSource.renderItems();
        this._onChange(0);
      }

      this.updateTotalDue();
  }

  isReadOnlyRow(item: InWarehouseItem): boolean {
    return !this.isNewItem && !this.isReturnMode && item.purchaseOrderClosed;
  }

  updateBalance(index: number) {
    const quantityValue = this.getArrayFormGroup(index).get('quantity').value;

    if (isNumberPattern(quantityValue)) {
      const item = this.dataSource.items[index] as InWarehouseItem;
      item.balance = item.originalBalance - Number(quantityValue);
    }

    this.updateTotalDue();
  }

  updateTotalDue() {
    const totalQuantityDue = this.totalQuantityDue;
    if (this.savedItemsAmount !== totalQuantityDue) {
      this.totalItemAmountChanged.emit(totalQuantityDue);
    }
  }

  get noItemCreatedError(): boolean {
    return this.dataSource.items.length === 0;
  }

  get balanceIsMinusError(): boolean {
    return this.dataSource.items.some((item: InWarehouseItem) => item.balance < 0);
  }

  get allZeroQuantityError(): boolean {
    return this.dataSource.items.length > 0 && this.dataSource.items.every((item: InWarehouseItem) => Number(item.quantity) === 0);
  }

  protected hasOtherError(): boolean {
    if (this.noItemCreatedError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.noItemCreated')
      );

      return true;
    }

    if (this.balanceIsMinusError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.balanceIsMinus')
      );

      return true;
    }

    if (this.allZeroQuantityError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.allZeroQuantityError')
      );

      return true;
    }
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;
    this.item = obj;

    if (obj) {
      this.dataSource.loadItems(obj);
    }

    this.isNewItem = isNullOrUndefined(obj);
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }

  validate(c: FormControl): ValidationErrors {
    return this.oForm.errors;
  }
}
