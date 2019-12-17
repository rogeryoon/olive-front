import { Component, Input, Output, EventEmitter, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { String } from 'typescript-string-operations';

import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OliveOrderShipOutPackageService } from 'app/main/sales/services/order-ship-out-package.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveOnShare } from 'app/core/interfaces/on-share';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OlivePreviewPickingListComponent } from '../preview-picking-list/preview-picking-list.component';
import { MatDialog } from '@angular/material';
import { OlivePreviewDialogComponent } from 'app/core/components/dialogs/preview-dialog/preview-dialog.component';
import { AlertService, DialogType } from '@quick/services/alert.service';
import { OlivePreviewPackingListComponent } from '../preview-packing-list/preview-packing-list.component';
import { OliveShipperExcelService } from 'app/main/sales/services/shipper-excel.service';
import { CompanyContact } from 'app/core/models/company-contact.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveCompanyContactEditorComponent } from 'app/core/components/entries/company-contact-editor/company-contact-editor.component';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';
import { MarketSeller } from 'app/main/supports/models/market-seller.model';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OrderShipOutPackageExtra } from 'app/main/sales/models/order-ship-out-package-extra.model';
import { OrderShipOut } from 'app/main/sales/models/order-ship-out.model';
import { numberFormat } from 'app/core/utils/number-helper';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveOrderShipOutHelperService } from 'app/main/sales/services/order-ship-out-helper.service';
import { Icon } from 'app/core/models/icon';
import { Country } from 'app/main/supports/models/country.model';
import { convertToBase26 } from 'app/core/utils/encode-helpers';

@Component({
  selector: 'olive-pending-order-ship-out-package-list',
  templateUrl: './pending-order-ship-out-package-list.component.html',
  styleUrls: ['./pending-order-ship-out-package-list.component.scss']
})
export class OlivePendingOrderShipOutPackageListComponent extends OliveEntityFormComponent implements AfterContentChecked {
  @Input()
  warehouse: Warehouse;

  @Input()
  warehouses: Warehouse[];

  @Input()
  index: number;

  parentObject: OliveOnShare;

  packages: OrderShipOutPackage[] = [];

  /**
   * 필더된 오더
   */
  filteredPackages: OrderShipOutPackage[] = null;  

  countries: Map<number, Country>;
  customsConfigs = new Map<string, any>();

  packagesContact = new Map<number, CompanyContact>();
  companyContacts: CompanyContact[] = [];
  marketSellerContacts = new Map<number, CompanyContact[]>();
  marketSellers = new Map<number, MarketSeller>();

  selectedAll: any;

  filterCustomsIssues = null;
  filterKeyword = '';

  isAddUpCustomsTaxing = null;

  @Output() packagesCanceled = new EventEmitter();
  @Output() reload = new EventEmitter<any>();

  tableId = 'right-' + Math.floor(Math.random() * 100000);

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private messageHelper: OliveMessageHelperService, private orderShipOutPackageService: OliveOrderShipOutPackageService,
    private dialog: MatDialog, private alertService: AlertService,
    private shipperExcelService: OliveShipperExcelService, private cacheService: OliveCacheService,
    private cdRef: ChangeDetectorRef, private orderShipOutHelperService: OliveOrderShipOutHelperService,
    private documentService: OliveDocumentService
  ) {
    super(
      formBuilder, translator
    );
  }

  /**
   * showSenderCompany Tooltip Expression Check Error때문에 Change Detection 적용
   */
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  get remarkSelectedPackages(): string {
    const totalPackageCount = this.selectedPackages.length;
    let totalWeight = 0;

    this.selectedPackages.forEach(box => {
      box.orderShipOuts.forEach(order => {
        totalWeight += this.getOrderShipOutWeightDue(order);
      });
    });

    return totalPackageCount === 0 ? '' : ` (${this.commaNumber(totalPackageCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  get warehousePackages(): OrderShipOutPackage[] {
    return this.packages.filter(x => x.warehouseId === this.warehouse.id);
  }

  get allWarehousePackages(): OrderShipOutPackage[] {
    if (this.filteredPackages) {
      return this.filteredPackages;
    }
    return this.warehousePackages;
  }

  get selectedPackages(): OrderShipOutPackage[] {
    return this.allWarehousePackages.filter(x => x.selected);
  }

  get filtered(): boolean {
    return this.filterCustomsIssues != null ||
      this.filterKeyword.length > 0;
  }

  get packageRemark(): string {
    let totalWeight = 0;
    const totalPackageCount = this.allWarehousePackages.length;

    this.allWarehousePackages.forEach(item => {
      item.orderShipOuts.forEach(order => {
        totalWeight += this.getOrderShipOutWeightDue(order);
      });
    });

    return totalPackageCount === 0 ? '' : ` (${this.commaNumber(totalPackageCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  /**
   * 합산과세를 적용할 창고인지 판단
   */
  get isAddUpCustomsTaxingWarehouse(): boolean {
    if (!this.isAddUpCustomsTaxing && this.packages.length > 0) {
      this.isAddUpCustomsTaxing = this.warehouses.filter(warehouse => 
        warehouse.companyMasterBranchFk.addressFk.countryId !== this.packages[0].deliveryAddressFk.countryId)
        .map(warehouse => warehouse.id).includes(this.warehouse.id);
    }

    if (this.isAddUpCustomsTaxing) {
      return true;
    }

    return false;
  }  

  get isloading(): boolean {
    return this.parentObject && this.parentObject.bool1;
  }

  setIsLoading(value: boolean) {
    this.parentObject.bool1 = value;
  }

  /**
   * 주문 아이템 무게 합을 구한다.
   * @param order OrderShipOut
   * @returns 합산값
   */  
  getOrderShipOutWeightDue(order: OrderShipOut): number {
    return this.orderShipOutHelperService.getOrderShipOutKiloWeightDue(order);
  }

  selectAll() {
    this.allWarehousePackages.forEach(item => {
      item.selected = this.selectedAll;
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.allWarehousePackages.every(x => x.selected);
  }

  setConfigs(configType: string, data: any) {
    switch (configType)
    {
      case OliveConstants.listerConfigType.customsConfigs:
          this.customsConfigs = data;
      break;

      case OliveConstants.listerConfigType.countries:
          this.countries = data;
          break;      
    }
  }

  startTable(packages: OrderShipOutPackage[], parentObject: any, refresh: boolean) {
    this.parentObject = parentObject;

    this.packages = packages;

    if (!refresh) {
      this.initialize();
    }
  }

  initialize() {
  }

  setMarketSellerContacts() {
    // Cache에서 가져올것이 무엇인지 marketSellerFk.id별로 정리한다.
    for (const box of this.allWarehousePackages) {
      for (const order of box.orderShipOuts) {
        const key = order.orderFk.marketSellerFk.id;
        if (!this.marketSellerContacts.has(key)) {
          this.marketSellerContacts.set(key, null);
          this.marketSellers.set(key, order.orderFk.marketSellerFk);
        }
      }
    }

    for (const marketSellerId of Array.from(this.marketSellerContacts.keys())) {
      // 컨텍 데이터가 없는 경우만 Cache에서 가져온다.
      if (!this.marketSellerContacts.get(marketSellerId)) {
        this.cacheService.getCompanyGroupPreference(this.cacheService.keyShippingLabelShippers(this.warehouse.id, marketSellerId))
          .then((contacts: CompanyContact[]) => {
            if (contacts) {
              this.marketSellerContacts.set(marketSellerId, contacts);
              this.companyContacts = this.companyContacts.concat(contacts);
            }
          });
      }
    }
  }

  showSeller(box: OrderShipOutPackage): string {
    return box.orderShipOuts[0].orderFk.marketSellerFk.code;
  }

  showSenderCharacters(box: OrderShipOutPackage): string {
    const markerSellerId = box.orderShipOuts[0].orderFk.marketSellerFk.id;
    const contacts = this.marketSellerContacts.get(markerSellerId);

    let foundIndex = -1;
    if (contacts) {
      // 이미 지정된 컨텍이 없으면 
      if (!this.packagesContact.has(box.id)) {
        // 예외 컨텍이 지정되어 있으면 예외 컨텍 먼저 지정
        if (box.extra && box.extra.companyContactId) {
          const found = this.companyContacts.find(x => x.marketSellerId === markerSellerId && x.id === box.extra.companyContactId);
          if (found) {
            this.packagesContact.set(box.id, found);
          }
        }

        // 모두 해당 되지 않으면, 기본지정을 찾아 지정/저장한다.
        if (!this.packagesContact.has(box.id)) {
          const found = this.companyContacts.find(x => x.marketSellerId === markerSellerId && x.default);
          if (found) {
            this.packagesContact.set(box.id, found);
          }
        }
      }

      foundIndex = this.companyContacts.findIndex(x => x.id === this.packagesContact.get(box.id).id);
    }

    if (foundIndex === -1) {
      return '?';
    }

    return convertToBase26(foundIndex + 1);
  }

  /**
   * Shows items name
   * @param box 
   * @returns items name 
   */
  showItemsName(box: OrderShipOutPackage): string {
    const itemNames = new Map<string, number>();
    for (const order of box.orderShipOuts) {
      for (const item of order.orderShipOutDetails) {
        const itemId = convertToBase26(item.productVariantShortId);
        const itemNameKey = `${itemId}. ${item.productName}`;
        itemNames.set(itemNameKey, 
          (itemNames.has(itemNameKey) ? itemNames.get(itemNameKey) : 0) + item.quantity);
      }
    }

    const outputItemNames: string[] = [];
    for (const itemNameKey of Array.from(itemNames.keys())) {
      outputItemNames.push(`${itemNameKey} (${itemNames.get(itemNameKey)})`);
    }
    
    return outputItemNames.join(' , ');
  }

  showMarketOrderNumbers(box: OrderShipOutPackage): string {
    return box.orderShipOuts.map(order => order.orderFk.marketOrderNumber).join();
  }

  showSenderCompany(box: OrderShipOutPackage): string {
    let companyName = '';
    const markerSellerId = box.orderShipOuts[0].orderFk.marketSellerFk.id;
    const contact = this.packagesContact.get(markerSellerId);

    if (contact) {
      companyName = contact.companyName;
    }

    return companyName;
  }

  showQuantity(box: OrderShipOutPackage): string {
    let quantity = 0;

    box.orderShipOuts.forEach(order => {
      quantity += order.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0);
    });

    return this.commaNumber(quantity);
  }

  showWeight(box: OrderShipOutPackage): string {
    let weight = 0;

    box.orderShipOuts.forEach(order => {
      weight += this.getOrderShipOutWeightDue(order);
    });

    return numberFormat(weight, 2);
  }

  /**
   * Determines whether same country is
   * @param warehouse 
   * @param order 
   * @returns  
   */
  private isSameCountry(warehouse: Warehouse, countryId: number) {
    return warehouse.companyMasterBranchFk.addressFk.countryId === countryId;
  }

  /**
   * Gets ship out status icons
   * @param order 
   * @returns ship out status icons 
   */  
  getShipOutStatusIcons(box: OrderShipOutPackage): Icon[] {
    const icons = new Array<Icon>();

    if (this.isSameCountry(this.warehouse, box.deliveryAddressFk.countryId)) {
      return icons;
    }

    const addUpCustomsTaxingIcon = this.getAddUpCustomsTaxingIcon(box);

    if (addUpCustomsTaxingIcon) {
      icons.push(addUpCustomsTaxingIcon);
    }

    const customsRule = this.orderShipOutHelperService.getCustomsRule(
      box.deliveryAddressFk.countryId, this.countries, this.customsConfigs);

    const groupCustomsTypeMap = this.orderShipOutHelperService.getGroupCustomsTypeMap(customsRule);

    const customsWarningIcon = this.orderShipOutHelperService.getCustomsWarningIcon(box.orderShipOuts, customsRule, groupCustomsTypeMap);

    if (customsWarningIcon) {
      icons.push(customsWarningIcon);
    }

    return icons;
  }

  
  /**
   * 합산과세 검사
   * @param thisBox 
   * @returns 합산과세 아이콘 
   */
  getAddUpCustomsTaxingIcon(thisBox: OrderShipOutPackage): Icon {
    if (!this.isAddUpCustomsTaxingWarehouse) {
      return null;
    }

    const addUpCustomsTaxingBox = this.packages.find(box =>
      box.id !== thisBox.id && 
      box.deliveryTagFk.customsId && thisBox.deliveryTagFk.customsId &&
      box.deliveryTagFk.customsId.toLowerCase() === thisBox.deliveryTagFk.customsId.toLowerCase()
    );

    if (addUpCustomsTaxingBox) {
      const warehouseCode = this.warehouses.find(warehouse => warehouse.id === thisBox.warehouseId).code;
      const orderNumberShortTitle = this.translator.get('common.word.orderNumberShort');
      const boxFirstOrderNumberShortValue = thisBox.orderShipOuts[0].orderFk.marketOrderNumber;
      const consigneeNameTitle = this.translator.get('common.word.consigneeName');
      const consigneeNameValue = thisBox.deliveryTagFk.consigneeName;
      return {
        name: OliveConstants.shipOutIcon.customsAddUpCustomsTaxingIcon,
        tooltip: String.Format(this.translator.get('common.message.addUpCustomsTaxingStatus'), 
        `${warehouseCode} - ${orderNumberShortTitle}:${boxFirstOrderNumberShortValue} - ${consigneeNameTitle}: ${consigneeNameValue}`)
      };
    }

    return null;
  }

  buttonFilterNoCustomsIssuesPackages() {
    this.filterCustomsIssues = false;
    this.filterPackages();
  }

  buttonFilterCustomsIssuesPackages() {
    this.filterCustomsIssues = true;
    this.filterPackages();    
  }

  buttonRemoveFilters() {
    this.filterCustomsIssues = null;
    this.filterKeyword = '';
    this.filteredPackages = null;
  }

  get removeFilterTitle() {
    let filterName = '';

    if (this.filterCustomsIssues) {
      filterName = this.translator.get('common.menu.filterCustomsIssuesOrders');
    }
    else if (this.filterCustomsIssues === false) {
      filterName = this.translator.get('common.menu.filterNoCustomsIssuesOrders');
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
   * 키워드 검색 입력 이벤트 처리
   * @param searchValue 
   */
  onSearchChange(searchValue: string) {
    this.filterKeyword = searchValue.trim();

    if (this.filterKeyword.length === 0 && !this.filtered) {
      this.buttonRemoveFilters();
      return;
    }

    this.filterPackages();
  }

  /**
   * Filters packages
   */
  private filterPackages() {
    this.filteredPackages = this.warehousePackages;
    const keyword = this.filterKeyword.toLowerCase();
    if (keyword.length > 0) {
      this.filteredPackages = this.filteredPackages.filter(box =>
        box.deliveryTagFk.consigneeName && box.deliveryTagFk.consigneeName.toLocaleLowerCase().includes(keyword) ||
        box.deliveryTagFk.customsId && box.deliveryTagFk.customsId.toLocaleLowerCase().includes(keyword) ||
        box.trackingNumber && box.trackingNumber.toLocaleLowerCase().includes(keyword) ||
        box.orderShipOuts.some(order => 
          order.orderFk.marketSellerFk.code && order.orderFk.marketSellerFk.code.toLowerCase().includes(keyword) ||
          order.orderFk.marketOrderNumber && order.orderFk.marketOrderNumber.toLowerCase().includes(keyword) ||
          order.orderShipOutDetails.some(x => x.productName && x.productName.toLowerCase().includes(keyword))
        ));
    }

    // 통관 문제건
    if (this.filterCustomsIssues) {
      this.filteredPackages = this.filteredPackages.filter(order => this.getShipOutStatusIcons(order).length > 0);
    }
    // 통관 문제 정상건
    else if (this.filterCustomsIssues === false) {
      this.filteredPackages = this.filteredPackages.filter(order => this.getShipOutStatusIcons(order).length === 0);
    }
  }

  /**
   * Cancels ship out packages
   */
  cancelShipOutPackages() {
    this.setIsLoading(true);
    const orderShipOutIds: number[] = [];
    this.selectedPackages.forEach(item => {
      item.orderShipOuts.forEach(order => {
        orderShipOutIds.push(order.id);
      });
    });

    this.orderShipOutPackageService.cancelPackages(orderShipOutIds).subscribe(
      response => {
        this.setIsLoading(false);
        this.onPackagesCanceled(response);
      },
      error => {
        this.setIsLoading(false);
        this.messageHelper.showStickySaveFailed(error, false);
      }
    );
  }

  /**
   * 캔슬된 패키지를 삭제하고 Reload한다.
   * @param response 
   */
  private onPackagesCanceled(response: any) {
    for (let i = this.packages.length - 1; i >= 0; i--) {
      if (this.packages[i].warehouseId === this.warehouse.id && this.packages[i].selected) {
        this.packages.splice(i, 1);
      }
    }
    this.packagesCanceled.emit();

    this.selectedAll = false;
  }

  /**
  * 패키지에 관한 부
  * @param box OrderShipOutPackage
  */
  private saveShipOutExtra(box: OrderShipOutPackage) {
    this.orderShipOutPackageService.put(`extra/${box.id}/`, box.extra).subscribe(
      response => {
        box = response.model as OrderShipOutPackage;
      },
      error => this.messageHelper.showStickySaveFailed(error, false)
    );
  }

  /**
   * 출고 완료 처리 - 최종 확인한 후 백앤드로 전송
   */
  finishShipOutPackage() {
    this.setIsLoading(true);
    const packageIds: number[] = [];
    this.selectedPackages.forEach(item => {
      packageIds.push(item.id);
    });

    this.alertService.showDialog(
      this.translator.get('common.title.finalConfirm'),
      this.translator.get('sales.pendingOrderShipOutPackageList.finalFinishConfirmMessage'),
      DialogType.confirm,
      () => {
        this.orderShipOutPackageService.finishPackages(packageIds).subscribe(
          response => {
            this.setIsLoading(false);
            this.onPackagesCanceled(response);
          },
          error => {
            this.setIsLoading(false);
            this.messageHelper.showStickySaveFailed(error, false);
          }
        );

        this.selectedAll = false;
      },
      () => null,
      this.translator.get('common.button.yes'),
      this.translator.get('common.button.no')
    );
  }

  /**
   * 픽킹 리스트 인쇄
   */
  printPickingList() {
    const dialogSetting = new OliveDialogSetting(
      OlivePreviewPickingListComponent,
      {
        item: this.selectedPackages,
        hideExcelButton: true
      }
    );

    this.dialog.open(
      OlivePreviewDialogComponent,
      {
        disableClose: false,
        panelClass: 'mat-dialog-md',
        data: dialogSetting
      });
  }

  /**
  * 팩킹 리스트 인쇄
  */
  printPackingList() {
    const dialogSetting = new OliveDialogSetting(
      OlivePreviewPackingListComponent,
      {
        item: this.selectedPackages,
        hideExcelButton: true
      }
    );

    this.dialog.open(
      OlivePreviewDialogComponent,
      {
        disableClose: false,
        panelClass: 'mat-dialog-md',
        data: dialogSetting
      });
  }

  // TODO : printShippingLabel
  printShippingLabel() {
    console.log('printShippingLabel');
  }

  // TODO : exportForTrackingNumberUpdate
  exportForTrackingNumberUpdate() {
    console.log('exportForTrackingNumberUpdate');
  }

  /**
   * 택배 엑셀 저장 
   */
  exportForLogistic() {
    for (const marketSellerId of Array.from(this.marketSellerContacts.keys())) {
      const seller = this.marketSellers.get(marketSellerId);
      if (!this.marketSellerContacts.get(marketSellerId)) {
        const message = String.Format(
          this.translator.get(
            'sales.pendingOrderShipOutPackageList.confirmCanNotProcessDueToNoCompanyContact'
            ), 
            `${seller.name} [${seller.code}]`
        );
                
        this.alertService.showDialog(
          this.translator.get('common.title.confirm'),
          message,
          DialogType.confirm,
          () => this.openMarketSellerContactEditor(marketSellerId),
          () => null,
          this.translator.get('common.button.yes'),
          this.translator.get('common.button.no')
        );
        return;
      }
    }

    this.shipperExcelService.saveForGps(this.allWarehousePackages, this.packagesContact, this.customsConfigs);
  }

  /**
   * Exports order list
   */
  // TODO : exportPackageList : 와꾸미정이라 보류중  
  exportPackageList() {
    this.documentService.exportHtmlTableToExcel(
      this.translator.get('sales.pendingOrderShipOutPackageList.fileName'), 
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

  editCompanyContact(box: OrderShipOutPackage) {
    const contact = this.packagesContact.get(box.id);

    if (contact) {
      this.openMarketSellerContactEditor(contact.marketSellerId, contact, box);
    }
    else {
      const markerSellerId = box.orderShipOuts[0].orderFk.marketSellerFk.id;
      this.openMarketSellerContactEditor(markerSellerId, null, box);
    }
  }

  private openMarketSellerContactEditor(marketSellerId: number, contact: CompanyContact = null, box: OrderShipOutPackage = null) {
    const marketSeller = this.marketSellers.get(marketSellerId);
    const savedCompanyContactId = (box && box.extra && box.extra.companyContactId) ? box.extra.companyContactId : null;

    const deepCopiedContacts = _.cloneDeep(this.marketSellerContacts.get(marketSellerId));

    let deepCopiedContact = null;
    if (deepCopiedContacts) {
      deepCopiedContact = deepCopiedContacts.find(x => x.id === contact.id);
    }

    // 회사 컨텍정보 수정창 오픈
    const setting = new OliveDialogSetting(
      OliveCompanyContactEditorComponent,
      {
        item: deepCopiedContact,
        itemType: CompanyContact,
        customTitle: `${this.translator.get('common.title.shippingLabelShippersEntry')} - ${marketSeller.code}`,
        hideDelete: true,
        extraParameter: {
          marketSellerId: marketSeller.id,
          warehouseId: this.warehouse.id,
          contacts: deepCopiedContacts
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

    // Contact 업데이트
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedId = result.selectedId as number;
        const savedContacts = result.contacts as CompanyContact[];

        const currentContacts = this.marketSellerContacts.get(marketSellerId);

        const arrangedContacts = this.updateCurrentContacts(currentContacts, savedContacts);

        if (arrangedContacts) {
          // 캐쉬 저장
          this.cacheService.setCompanyGroupPreference(
            this.cacheService.keyShippingLabelShippers(this.warehouse.id, marketSellerId),
            arrangedContacts
          );

          // 박스를 선택한 경우 업데이트가 필요하다면
          if (box && savedCompanyContactId !== selectedId) {
            this.packagesContact.set(box.id, arrangedContacts.find(x => x.id === selectedId));

            if (!box.extra) {
              box.extra = new OrderShipOutPackageExtra();
            }

            box.extra.companyContactId = selectedId;

            this.saveShipOutExtra(box);
          }
        }
      }
    });
  }

  /**
   * 기존 저장된 컨텍들이 있을 경우 편집창에서 저장된 컨텍들과 비교대조 업데이트
   * @param currentContacts CompanyContact[]
   * @param savedContacts CompanyContact[]
   * @returns current contacts 
   */
  private updateCurrentContacts(currentContacts: CompanyContact[], savedContacts: CompanyContact[]): CompanyContact[] {
    if (currentContacts) {
      //#region 삭제

      // 기존 컨텍에 저장 컨텍이 없으면 삭제
      const deleteContacts: CompanyContact[] = [];
      for (const ct of currentContacts) {
        if (!savedContacts.find(x => x.id === ct.id)) {
          deleteContacts.push(ct);
        }
      }

      // 패키지 맵에서 찾아서 삭제
      for (const boxId of Array.from(this.packagesContact.keys())) {
        const packageContact = this.packagesContact.get(boxId);
        for (const delContact of deleteContacts) {
          if (packageContact && packageContact.id === delContact.id) {
            this.packagesContact.delete(boxId);
          }
        }
      }

      // 컨텍 배열 / 마켓셀러 맵에서 찾아서 삭제
      for (const delContact of deleteContacts) {
        let index = this.companyContacts.findIndex(x => x.id === delContact.id);
        this.companyContacts.splice(index, 1);
        index = currentContacts.findIndex(x => x.id === delContact.id);
        currentContacts.splice(index, 1);
      }
      //#endregion 삭제

      // 기존 컨텍과 매치되는 컨텍이 있으면 업데이트
      for (const ct of currentContacts) {
        const matchedContact = savedContacts.find(x => x.id === ct.id);
        if (matchedContact) {
          Object.assign(ct, matchedContact);
        }
      }

      // 저장컨텍에 기존컨텍 매치가 안되면 삽입
      for (const ct of savedContacts) {
        const found = currentContacts.find(x => x.id === ct.id);
        if (!found) {
          currentContacts.push(ct);
          this.companyContacts.push(ct);
        }
      }

      return currentContacts;
    }
    else {
      this.marketSellerContacts.set(savedContacts[0].marketSellerId, savedContacts);
      this.companyContacts = this.companyContacts.concat(savedContacts);

      return savedContacts;
    }
  }

  initializeChildComponent() {
  }

  cleanUpChildComponent() {
  }
}

