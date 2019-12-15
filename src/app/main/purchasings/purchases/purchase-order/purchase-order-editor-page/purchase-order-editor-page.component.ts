import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFactoryResolver } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountService } from '@quick/services/account.service';

import { OliveEditPageComponent } from 'app/core/components/extends/edit-page/edit-page.component';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { AlertService } from '@quick/services/alert.service';

@Component({
  selector: 'olive-purchase-order-editor-page',
  templateUrl: '../../../../../core/components/extends/edit-page/edit-page.component.html',
  styleUrls: ['../../../../../core/components/extends/edit-page/edit-page.component.scss'],
  animations: fuseAnimations
})
export class OlivePurchaseOrderEditorPageComponent extends OliveEditPageComponent {
  constructor(
    private route: ActivatedRoute, componentFactoryResolver: ComponentFactoryResolver,
    translator: FuseTranslationLoaderService, accountService: AccountService,
    alertService: AlertService, router: Router
  ) {
    super(
      componentFactoryResolver, translator,
      accountService, alertService, router
    );
  }

  initializeChildComponent() {
    this.setting = {
      component: OlivePurchaseOrderManagerComponent,
      itemType: PurchaseOrder,
      managePermission: null,
      iconName: NavIcons.Purchase.entry,
      translateTitleId: NavTranslates.Purchase.entry,
      itemListPath: 'purchases/list',
      noHeader: true
    };

    this.route.data.subscribe(({ item }) => {
      if (item) {
        this.setting.item = item;
      }
    });
  }
}
