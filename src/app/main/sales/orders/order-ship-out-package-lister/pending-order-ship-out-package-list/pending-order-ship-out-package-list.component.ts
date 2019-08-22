import { Component, Input, Output, EventEmitter, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
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
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { numberFormat } from 'app/core/utils/number-helper';
import { OliveConstants } from 'app/core/classes/constants';

@Component({
  selector: 'olive-pending-order-ship-out-package-list',
  templateUrl: './pending-order-ship-out-package-list.component.html',
  styleUrls: ['./pending-order-ship-out-package-list.component.scss']
})
export class OlivePendingOrderShipOutPackageListComponent extends OliveEntityFormComponent implements AfterContentChecked {
  @Input()
  warehouse: Warehouse;

  @Input()
  index: number;

  parentObject: OliveOnShare;

  packages: OrderShipOutPackage[] = [];

  customsConfigs = new Map<string, any>();

  packagesContact = new Map<number, CompanyContact>();
  companyContacts: CompanyContact[] = [];
  marketSellerContacts = new Map<number, CompanyContact[]>();
  marketSellers = new Map<number, MarketSeller>();

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  selectedAll: any;

  @Output() packagesCanceled = new EventEmitter();
  @Output() reload = new EventEmitter<any>();

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private messageHelper: OliveMessageHelperService, private orderShipOutPackageService: OliveOrderShipOutPackageService,
    private dialog: MatDialog, private alertService: AlertService,
    private shipperExcelService: OliveShipperExcelService, private cacheService: OliveCacheService,
    private cdRef: ChangeDetectorRef
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

  get packageRemark(): string {
    let totalWeight = 0;
    const totalPackageCount = this.warehousePackages.length;

    this.warehousePackages.forEach(item => {
      item.orderShipOuts.forEach(order => {
        totalWeight += this.getOrderShipOutWeightDue(order);
      });
    });

    return totalPackageCount === 0 ? '' : ` (${this.commaNumber(totalPackageCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  /**
   * 주문 아이템 무게 합을 구한다.
   * @param order OrderShipOut
   * @returns 합산값
   */  
  getOrderShipOutWeightDue(order: OrderShipOut): number {
    return OlivePendingOrderShipOutListComponent.getOrderShipOutKiloWeightDue(order);
  }

  get isloading(): boolean {
    return this.parentObject && this.parentObject.bool1;
  }

  setIsLoading(value: boolean) {
    this.parentObject.bool1 = value;
  }

  selectAll() {
    this.warehousePackages.forEach(item => {
      item.selected = this.selectedAll;
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.packages.every(x => x.selected);
  }

  setConfigs(configType: string, data: any) {
    switch (configType)
    {
      case OliveConstants.listerConfigType.customsConfigs:
          this.customsConfigs = data;
      break;
    }
  }

  startTable(packages: OrderShipOutPackage[], parentObject: any, refresh: boolean) {
    this.parentObject = parentObject;

    this.packages = packages;

    if (!refresh) {
      this.dtTrigger.next();
    }
  }

  getMarketSellerContacts() {
    // Cache에서 가져올것이 무엇인지 marketSellerFk.id별로 정리한다.
    for (const box of this.warehousePackages) {
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

  get warehousePackages() {
    return this.packages.filter(x => x.warehouseId === this.warehouse.id);
  }

  get selectedPackages(): OrderShipOutPackage[] {
    return this.warehousePackages.filter(x => x.selected);
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

    return OliveDocumentService.numToAlpha(foundIndex);
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

    this.shipperExcelService.saveForGps(this.warehousePackages, this.packagesContact, this.customsConfigs);
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

