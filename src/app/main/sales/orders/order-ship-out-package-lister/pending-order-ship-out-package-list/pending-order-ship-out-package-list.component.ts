import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OliveUtilities } from 'app/core/classes/utilities';
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

@Component({
  selector: 'olive-pending-order-ship-out-package-list',
  templateUrl: './pending-order-ship-out-package-list.component.html',
  styleUrls: ['./pending-order-ship-out-package-list.component.scss']
})
export class OlivePendingOrderShipOutPackageListComponent extends OliveEntityFormComponent {
  @Input()
  warehouse: Warehouse;

  @Input()
  index: number;

  parentObject: OliveOnShare;

  packages: OrderShipOutPackage[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  selectedAll: any;

  @Output() packagesCanceled = new EventEmitter();
  @Output() reload = new EventEmitter<any>();

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private messageHelper: OliveMessageHelperService, private orderShipOutPackageService: OliveOrderShipOutPackageService,
    private dialog: MatDialog, private alertService: AlertService,
    private shipperExcelService: OliveShipperExcelService
  ) {
    super(
      formBuilder, translator
    );
  }

  get remarkSelectedPackages(): string {
    const totalPackageCount = this.selectedPackages.length;
    let totalWeight = 0;

    this.selectedPackages.forEach(item => {
      item.orderShipOuts.forEach(order => {
        totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);
      });
    });

    return totalPackageCount === 0 ? '' : ` (${this.commaNumber(totalPackageCount)}/${this.commaNumber(totalWeight)}Kg)`;
  }

  get packageRemark(): string {
    let totalWeight = 0;
    const totalPackageCount = this.warehousePackages.length;

    this.warehousePackages.forEach(item => {
      item.orderShipOuts.forEach(order => {
        totalWeight += order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);
      });
    });

    return totalPackageCount === 0 ? '' : ` (${this.commaNumber(totalPackageCount)}/${this.commaNumber(totalWeight)}Kg)`;
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

  startTable(packages: OrderShipOutPackage[], parentObject: any) {
    this.parentObject = parentObject;

    this.packages = packages;

    this.dtTrigger.next();
  }

  get warehousePackages() {
    return this.packages.filter(x => x.warehouseId === this.warehouse.id);
  }

  get selectedPackages(): OrderShipOutPackage[] {
    return this.warehousePackages.filter(x => x.selected);
  }

  showSeller(item: OrderShipOutPackage): string {
    return item.orderShipOuts[0].orderFk.marketSellerFk.code;
  }

  showQuantity(item: OrderShipOutPackage): string {
    let quantity = 0;

    item.orderShipOuts.forEach(order => {
      quantity += order.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0);
    });

    return this.commaNumber(quantity);
  }

  showWeight(item: OrderShipOutPackage): string {
    let weight = 0;

    item.orderShipOuts.forEach(order => {
      weight += order.orderShipOutDetails.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);
    });

    return OliveUtilities.numberFormat(weight, 2);
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

  // 캔슬된 패키지를 삭제하고 Reload한다.
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
  
  // TODO : exportForLogistic
  exportForLogistic() {
    this.shipperExcelService.saveForGps(this.selectedPackages);
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

