import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OliveBaseComponent } from 'app/core/components/extends/base/base.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveCompanyService } from 'app/main/supports/services/company.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { Branch } from 'app/main/supports/models/branch.model';
import { OliveBranchService } from 'app/main/supports/services/branch.service';
import { purchaseOrderId } from 'app/core/utils/olive-helpers';

@Component({
  selector: 'olive-preview-purchase-order',
  templateUrl: './preview-purchase-order.component.html',
  styleUrls: ['./preview-purchase-order.component.scss']
})
export class OlivePreviewPurchaseOrderComponent extends OliveBaseComponent implements OliveOnPreview, OnInit {
  order: PurchaseOrder;
  digits: number;
  companyHtml: string;
  warehouseHtml: string;

  constructor(
    translator: FuseTranslationLoaderService, private cacheService: OliveCacheService,
    private companyService: OliveCompanyService, private documentService: OliveDocumentService,
    private branchService: OliveBranchService
  ) {
    super(translator);
  }

  set data(value: any) {
    this.order = value.item;
  }

  ngOnInit() {
    super.ngOnInit();
    this.standCurrency = this.cacheService.standCurrency;
    this.digits = this.standCurrency.decimalPoint;

    this.loadCompany();
  }

  loadCompany() {
    this.cacheService.getItem(this.companyService, 'company', this.order.warehouseFk.companyId)
      .then(item => {
        this.renderCompanyHtml(item);
      });

    this.cacheService.getItems(this.branchService, OliveCacheService.cacheKeys.getItemsKey.branch)
      .then(items => {
        const branch = items.find(b => b.id === this.order.warehouseFk.companyMasterBranchId);
        if (branch) {
          this.renderWarehouseHtml(branch);
        }
      });
  }

  renderCompanyHtml(company: any) {
    const values = [];

    this.companyHtml = `<strong>${company.name}</strong><br>`;

    if (company.addressFk) {
      values.push(this.address(company.addressFk));
    }

    if (company.phoneNumber) {
      values.push(company.phoneNumber);
    }

    this.companyHtml += '<p>' + values.join('<br>') + '</p>';
  }

  get subTotal(): number {
    if (!this.order) { return 0; }

    let value = 0;
    this.order.purchaseOrderItems.forEach(item => {
      value += item.quantity * item.price - item.discount;
    });

    return value;
  }

  get purchaseOrderId(): string {
    return purchaseOrderId(this.order);
  }

  get grandTotal(): number {
    return this.subTotal + this.order.freightAmount -
      this.order.addedDiscountAmount + this.order.taxAmount;
  }

  get paymentSummary(): string {
    const values = [];

    this.order.purchaseOrderPayments.filter(x => x.amount > 0).forEach(payment => {
      values.push(`${payment.code}: ${this.numberFormat(payment.amount, this.digits)}`);
    });

    return values.join(' / ');
  }

  get supplierHtml(): string {
    const values = [];

    const fk = this.order.supplierFk;

    values.push(`<strong>${fk.name} [${fk.code}]</strong>`);

    if (fk.address) {
      values.push(fk.address);
    }

    if (fk.phoneNumber) {
      values.push(fk.phoneNumber);
    }

    return values.join('<br/><br/>');
  }

  renderWarehouseHtml(branch: Branch) {
    const values = [];

    const fk = this.order.warehouseFk;

    values.push(`<strong>${fk.name} [${fk.code}]</strong>`);

    if (fk.companyMasterBranchId) {
      if (branch.addressFk) {
        values.push(this.address(branch.addressFk));
      }

      if (branch.phoneNumber) {
        values.push(branch.phoneNumber);
      }
    }

    this.warehouseHtml = values.join('<br/><br/>');
  }

  onPrint() {
    this.documentService.printPage(`Purchase Order ${this.purchaseOrderId}`, 'olivestyle', 'olive-container');
  }
  
  onExcel() {
    const summaries = [];

    summaries.push(`PO # : ${this.purchaseOrderId}`);
    summaries.push(`Date : ${this.date(this.order.date)}`);

    const vfk = this.order.supplierFk;
    summaries.push(`Supplier : ${vfk.name} [${vfk.code}]`);

    const wfk = this.order.warehouseFk;
    summaries.push(`Warehouse : ${wfk.name} [${wfk.code}]`);

    summaries.push(`${this.translator.get('purchasing.previewPurchaseOrder.subTotal')} : ${this.numberFormat(this.subTotal, this.digits)}`);
    summaries.push(`${this.translator.get('purchasing.previewPurchaseOrder.freight')} : ${this.numberFormat(this.order.freightAmount, this.digits)}`);
    summaries.push(`${this.translator.get('purchasing.previewPurchaseOrder.addedDiscount')} : ${this.numberFormat(this.order.addedDiscountAmount * -1, this.digits)}`);
    summaries.push(`${this.translator.get('purchasing.previewPurchaseOrder.tax')} : ${this.numberFormat(this.order.taxAmount, this.digits)}`);
    summaries.push(`${this.translator.get('purchasing.previewPurchaseOrder.grandTotal')} : ${this.numberFormat(this.grandTotal, this.digits)}`);

    this.documentService.exportHtmlTableToExcel(
      `PO-${this.id36(this.order.id)}`,
      'olive-table', false,
      summaries
    );
  }
}
