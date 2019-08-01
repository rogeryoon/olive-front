import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';
import { OliveBaseComponent } from 'app/core/components/extends/base/base.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OliveUtilities } from 'app/core/classes/utilities';

class PickingItem {
  productVariantId: number;
  productGroupId: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'olive-preview-picking-list',
  templateUrl: './preview-picking-list.component.html',
  styleUrls: ['./preview-picking-list.component.scss']
})
export class OlivePreviewPickingListComponent extends OliveBaseComponent implements OliveOnPreview, OnInit {
  packages: OrderShipOutPackage[];
  pickingItems: PickingItem[] = [];

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

    this.buildData();

    // Font Size 자동 동적 조정
    $(document).ready(function () {
      const boxListId = '.box-item div';
      $(boxListId).css('font-size', '1em');

      while ($(boxListId).height() > $('.box-item').height()) {
        $(boxListId).css('font-size', (parseInt($(boxListId).css('font-size'), 10) - 1) + 'px');
      }
    });
  }

  /**
   * Table Html Body에 표시할수 있도록 상품별로 수량을 합산 정리
   */
  buildData() {
    const pickingProductsMap = new Map<number, PickingItem>();

    // 제품별 합산
    for (const pkg of this.packages) {
      for (const order of pkg.orderShipOuts) {
        for (const item of order.orderShipOutDetails) {
          if (!pickingProductsMap.has(item.productVariantId)) {
            pickingProductsMap.set(
              item.productVariantId,
              {
                productVariantId: item.productVariantId,
                productGroupId: item.productId,
                name: item.name,
                quantity: 0
              } as PickingItem);
          }

          const pickingItem = pickingProductsMap.get(item.productVariantId);
          pickingItem.quantity += item.quantity;
          pickingProductsMap.set(item.productVariantId, pickingItem);
        }
      }
    }

    // 딕셔너리 구조를 배열로 전환
    for (const productVariantId of Array.from(pickingProductsMap.keys())) {
      this.pickingItems.push(pickingProductsMap.get(productVariantId));
    }

    // 배열을 상품 그룹 ID로 정열
    this.pickingItems.sort((a, b) => a.productGroupId < b.productGroupId ? -1 : a.productGroupId > b.productGroupId ? 1 : 0);
  }

  get totalItemCount(): string {
    return this.commaNumber(this.pickingItems.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0));
  }

  get today(): string {
    return OliveUtilities.isoDateString(new Date(), true);
  }

  onPrint() {
    this.documentService.printPage(
      `Picking List ${OliveUtilities.isoDateString(new Date(), true)}`,
      'olivestyle', 'olive-container'
    );
  }

  onExcel() { }
}
