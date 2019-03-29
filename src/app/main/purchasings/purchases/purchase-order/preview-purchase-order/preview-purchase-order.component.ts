import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { OliveBaseComponent } from 'app/core/components/extends/base/base.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveCompanyService } from 'app/main/supports/companies/services/company.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'olive-preview-purchase-order',
  templateUrl: './preview-purchase-order.component.html',
  styleUrls: ['./preview-purchase-order.component.scss']
})
export class OlivePreviewPurchaseOrderComponent extends OliveBaseComponent implements OliveOnPreview, OnInit {
  order: PurchaseOrder;
  digits: number;
  companyHtml: string;

  constructor(
    private translater: FuseTranslationLoaderService, private cacheService: OliveCacheService,
    private companyService: OliveCompanyService, private documentService: OliveDocumentService,
    private http: HttpClient, protected sanitizer: DomSanitizer
  ) {
    super();
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

  set data(value: any) {
    this.order = value.item;
  }

  get subTotal(): number {
    if (!this.order) { return 0; }

    let value = 0;
    this.order.purchaseOrderItems.forEach(item => {
      value += item.quantity * item.price - item.discount;
    });

    return value;
  }

  get grandTotal(): number {
    return this.subTotal + this.order.freightAmount -
      this.order.addedDiscountAmount + this.order.taxAmount;
  }

  get paymentSummary(): string {
    const values = [];

    this.order.purchaseOrderPayments.forEach(payment => {
      values.push(`${payment.code}: ${this.numberFormat(payment.amount, this.digits)}`);
    });

    return values.join(' / ');
  }

  get vendor(): string {
    const values = [];

    const fk = this.order.vendorFk;

    values.push(`<strong>${fk.name} [${fk.code}]</strong>`);

    if (fk.address) {
      values.push(fk.address);
    }

    if (fk.phoneNumber) {
      values.push(fk.phoneNumber);
    }

    return values.join('<br>');
  }

  get warehouse(): string {
    const values = [];

    const fk = this.order.warehouseFk;

    values.push(`<strong>${fk.name} [${fk.code}]</strong>`);

    if (fk.companyMasterBranchId) {
      const branch = this.cacheService.branches.find(b => b.id === fk.companyMasterBranchId);

      if (branch.addressFk) {
        values.push(this.address(branch.addressFk));
      }

      if (branch.phoneNumber) {
        values.push(branch.phoneNumber);
      }
    }

    return values.join('<br>');
  }

  onPrint() {
    this.documentService.printPage(
      `Purchase Order ${this.id36(this.order.id)}-${this.dateCode(this.order.date)}`, 
      'olivestyle', 'olive-container'
    );
  }

  onExcel() {
    const summaries = [];

    summaries.push(`PO # : ${this.id36(this.order.id)}-${this.dateCode(this.order.date)}`);
    summaries.push(`Date : ${this.date(this.order.date)}`);

    const vfk = this.order.vendorFk;
    summaries.push(`Vendor : ${vfk.name} [${vfk.code}]`);

    const wfk = this.order.warehouseFk;
    summaries.push(`Warehouse : ${wfk.name} [${wfk.code}]`);

    summaries.push(`${this.translater.get('purchasing.previewPurchaseOrder.subTotal')} : ${this.numberFormat(this.subTotal, this.digits)}`);
    summaries.push(`${this.translater.get('purchasing.previewPurchaseOrder.freight')} : ${this.numberFormat(this.order.freightAmount, this.digits)}`);
    summaries.push(`${this.translater.get('purchasing.previewPurchaseOrder.addedDiscount')} : ${this.numberFormat(this.order.addedDiscountAmount * -1, this.digits)}`);
    summaries.push(`${this.translater.get('purchasing.previewPurchaseOrder.tax')} : ${this.numberFormat(this.order.taxAmount, this.digits)}`);
    summaries.push(`${this.translater.get('purchasing.previewPurchaseOrder.grandTotal')} : ${this.numberFormat(this.grandTotal, this.digits)}`);

    this.documentService.exportExcel(
      `PO-${this.id36(this.order.id)}`,
      'olive-table', false,
      summaries
    );
  }
}
