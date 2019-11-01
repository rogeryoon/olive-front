import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFactoryResolver } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountService } from '@quick/services/account.service';

import { OliveEditPageComponent } from 'app/core/components/extends/edit-page/edit-page.component';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { AlertService } from '@quick/services/alert.service';
import { OliveOrderShipOutPackageListerManagerComponent } from '../order-ship-out-package-lister-manager/order-ship-out-package-lister-manager.component';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OrderShipOut } from 'app/main/sales/models/order-ship-out.model';

@Component({
  selector: 'olive-order-ship-out-package-lister-page',
  templateUrl: '../../../../../core/components/extends/edit-page/edit-page.component.html',
  styleUrls: ['../../../../../core/components/extends/edit-page/edit-page.component.scss'],
  animations: fuseAnimations
})
export class OliveOrderShipOutPackageListerPageComponent extends OliveEditPageComponent {
  warehouses: Warehouse[] = [];
    
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
    this.warehouses = this.route.snapshot.data.warehouses;

    this.setting = {
      component: OliveOrderShipOutPackageListerManagerComponent,
      itemType: OrderShipOut,
      managePermission: null,
      iconName: NavIcons.Sales.shipOutPackageLister,
      translateTitleId: NavTranslates.Sales.shipOutPackageLister,
      itemListPath: 'inwarehouses/list',
      disableBottomNavigation: true,
      noHeader: true
    };

    this.setting.item = this.warehouses;
  }
}
