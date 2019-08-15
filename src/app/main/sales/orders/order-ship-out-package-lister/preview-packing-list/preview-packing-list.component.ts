import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';
import { OliveBaseComponent } from 'app/core/components/extends/base/base.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { Address } from 'app/core/models/address.model';
import { isoDateString } from 'app/core/utils/date-helper';

class PackingItem {
  productVariantId: number;
  productGroupId: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'olive-preview-packing-list',
  templateUrl: './preview-packing-list.component.html',
  styleUrls: ['./preview-packing-list.component.scss']
})
export class OlivePreviewPackingListComponent extends OliveBaseComponent implements OliveOnPreview, OnInit {
  packages: OrderShipOutPackage[];

  constructor(
    translator: FuseTranslationLoaderService, private cacheService: OliveCacheService,
    private documentService: OliveDocumentService,
  ) {
    super(translator);
  }

  set data(value: any) {
    this.packages = value.item;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  boxItemCount(box: OrderShipOutPackage): string {
    return this.commaNumber(this.getItems(box).map(x => x.quantity).reduce((a, b) => a + (b || 0), 0));
  }

  getAddress(address: Address) {
    return Address.joinedAddressNoCountry(address);
  }

  getItems(box: OrderShipOutPackage): PackingItem[]{
    const items: PackingItem[] = [];

    for (const order of box.orderShipOuts) {
      for (const item of order.orderShipOutDetails) {
        const foundItem = items.find(x => x.productVariantId === item.productVariantId);
        if (foundItem) {
          foundItem.quantity += item.quantity;
        }
        else {
          items.push({
            productVariantId: item.productVariantId,
            productGroupId: item.productId,
            name: item.name,
            quantity: item.quantity
          } as PackingItem);
        }
      }
    }

    return items;
  }

  onPrint() {
    this.documentService.printPage(
      `Packing List ${isoDateString(new Date(), true)}`,
      'olivestyle', 'olive-container'
    );
  }

  onExcel() { }
}
