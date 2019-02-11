import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { OliveBaseComponent } from 'app/core/components/base/base.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { locale as english } from '../../i18n/en';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'olive-preview-purchase-order',
  templateUrl: './preview-purchase-order.component.html',
  styleUrls: ['./preview-purchase-order.component.scss']
})
export class OlivePreviewPurchaseOrderComponent extends OliveBaseComponent implements OliveOnPreview, OnInit {
  order: PurchaseOrder;
  digits: number;

  constructor(
    private translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) { 
    super();

    this.translater.loadTranslations(english);
  }

  ngOnInit() {
    super.ngOnInit();
    this.standCurrency = this.cacheService.standCurrency;
    this.digits = this.standCurrency.decimalPoint;
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
    return 'test';
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

    if (fk.companyMasterBranchFk) {
      // values.push(fk.companyMasterBranchFk.a);
    }

    // if (fk.phoneNumber) {
    //   values.push(fk.phoneNumber);
    // }

    return values.join('<br>');
  }

  onPrint() {

  }
}
