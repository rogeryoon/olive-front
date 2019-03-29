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
import { OliveInWarehouseManagerComponent } from '../in-warehouse-manager/in-warehouse-manager.component';
import { InWarehouse } from '../../models/in-warehouse.model';

@Component({
  selector: 'olive-in-warehouse-editor-page',
  templateUrl: '../../../../../core/components/extends/edit-page/edit-page.component.html',
  styleUrls: ['../../../../../core/components/extends/edit-page/edit-page.component.scss'],
  animations: fuseAnimations
})
export class OliveInWarehouseEditorPageComponent extends OliveEditPageComponent {
  constructor(
    private route: ActivatedRoute, componentFactoryResolver: ComponentFactoryResolver,
    translater: FuseTranslationLoaderService, accountService: AccountService,
    alertService: AlertService, router: Router
  ) {
    super(
      componentFactoryResolver, translater,
      accountService, alertService, router
    );
  }

  initializeChildComponent() {
    this.setting = {
      component: OliveInWarehouseManagerComponent,
      itemType: InWarehouse,
      managePermission: null,
      iconName: NavIcons.InWarehouse.Entry,
      translateTitleId: NavTranslates.InWarehouse.Entry,
      itemListPath: 'inwarehouses/list'
    };

    this.route.data.subscribe(({ item }) => {
      if (item) {
        this.setting.item = item;
      }
    });
  }
}
