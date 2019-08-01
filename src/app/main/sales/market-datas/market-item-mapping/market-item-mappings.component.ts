import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';

import { OliveSearchMarketItemMappingComponent } from './search-market-item-mapping/search-market-item-mapping.component';
import { OliveMarketItemMappingService } from '../../services/market-item-mapping.service';
import { MarketItemMapping } from '../../models/market-item-mapping.model';
import { OliveMarketItemMappingManagerComponent } from './market-item-mapping-manager/market-item-mapping-manager.component';
import { OliveUtilities } from 'app/core/classes/utilities';

const Selected  = 'selected';
const Id = 'id';
const InterfaceName = 'interfaceName';
const ExcelColumns = 'excelColumns';
const Products = 'products';

@Component({
  selector: 'olive-market-item-mapping',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./market-item-mappings.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketItemMappingsComponent extends OliveEntityListComponent {
  excelId: number;
  interfaceName: string;
  sub: any;

  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveMarketItemMappingService,
    private route: ActivatedRoute, private router: Router
  ) {
      super(
        translator, deviceService,
        alertService, accountService,
        messageHelper, documentService, 
        dialog, dataService
      );
  }

  get isExcelMasterIdPage(): boolean {
    return this.excelId !== 0;
  }

  initializeChildComponent() {
    this.sub = this.route.params.subscribe(params => {
      this.excelId = OliveUtilities.convertBase36ToNumber(params['id']);
    });

    this.interfaceName = decodeURI(this.route.snapshot.queryParamMap.get('name'));

    this.initEntityList();
  }

  initEntityList() {
    this.setting = {
      icon: NavIcons.Sales.matchItems,
      translateTitleId: NavTranslates.Sales.matchItems,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translator.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: InterfaceName, orderable: false, thName: this.translator.get('common.tableHeader.interfaceName'),  
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4
        { data: ExcelColumns, orderable: false, thName: this.translator.get('common.tableHeader.marketProduct'),  
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 5
        { data: Products, orderable: false, thName: this.translator.get('common.tableHeader.linkedProducts'),  
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
      ],
      editComponent: OliveMarketItemMappingManagerComponent,
      searchComponent: OliveSearchMarketItemMappingComponent,
      itemType: MarketItemMapping
    };

    if (this.isExcelMasterIdPage) {
      this.setting.extraSearches = [{name: 'excelId', value: this.excelId }];
    }
  }

  renderItem(item: MarketItemMapping, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;

      case InterfaceName:
        retValue = item.interfaceName;
        break;

      case ExcelColumns:
        if (item.excelColumns) {
          retValue = item.excelColumns.filter(f => f.userVisible).map(e => e.matchValue).join(' ');
        }
        break;

      case Products:
        if (item.products) {
          retValue = item.products.map(e => `[${e.quantity}]-${e.productName}`).join(' / ');
        }
        break;        
    }

    return retValue;
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  getEditorCustomTitle(item: MarketItemMapping) {
    const maxLength = 80;

    if (item) {
      const title = item.excelColumns.map(x => x.matchValue).join(' ').trim();

      let shortenTitle = title.substr(0, maxLength);

      if (title.length > maxLength) {
        shortenTitle += '...';
      }

      return shortenTitle;
    }
    else {
      return this.translator.get(NavTranslates.Sales.matchItems);
    }
  }

  onItemsLoaded() {
    if (this.isExcelMasterIdPage && this.recordsTotal === 0) {
      this.alertService.showDialog
      (
        this.translator.get('sales.marketItemMappings.linkProductMenuJobDoneTitle'),
        this.translator.get('sales.marketItemMappings.linkProductMenuJobDoneDescription'),
        DialogType.alert,
        () => this.router.navigateByUrl(`/data/market/orders/${this.id36(this.excelId)}?name=${encodeURI(this.interfaceName)}`)
      ); 
    }
  }

  onSaved(item: MarketItemMapping) {
    if (this.isExcelMasterIdPage) {
      this.reRender();
    }
  }
}
