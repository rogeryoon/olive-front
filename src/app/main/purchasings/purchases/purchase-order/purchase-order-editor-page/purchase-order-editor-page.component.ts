import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFactoryResolver } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountService } from '@quick/services/account.service';

import { OliveEditPageComponent } from 'app/core/components/edit-page/edit-page.component';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';

@Component({
  selector: 'olive-purchase-order-editor-page',
  templateUrl: '../../../../../core/components/edit-page/edit-page.component.html',
  styleUrls: ['../../../../../core/components/edit-page/edit-page.component.html'],
  animations: fuseAnimations
})
export class OlivePurchaseOrderEditorPageComponent extends OliveEditPageComponent {
  constructor(
    private route: ActivatedRoute, componentFactoryResolver: ComponentFactoryResolver,
    translater: FuseTranslationLoaderService, accountService: AccountService
  ) {
    super(
      componentFactoryResolver, translater,
      accountService
    );
  }

  initializeChildComponent() {
    this.setting = {
      component: OlivePurchaseOrderManagerComponent,
      itemType: PurchaseOrder,
      managePermission: null,
      iconName: NavIcons.Purchase.PurchaseEntry,
      translateTitleId: NavTranslates.Purchase.PurchaseEntry,
      newItemPath: 'purchases/orders/0',
      itemListPath: 'purchases/purchase-orders'
    };

    this.route.data.subscribe(({ item }) => {
      if (item) {
        this.setting.item = item;
      }
    });
  }
}
