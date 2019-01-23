import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { PurchaseOrder } from '../../models/purchase-order.model';

@Component({
  selector: 'olive-purchase-order-editor-page',
  templateUrl: './purchase-order-editor-page.component.html',
  styleUrls: ['./purchase-order-editor-page.component.scss'],
  animations: fuseAnimations
})
export class OlivePurchaseOrderEditorPageComponent implements OnInit {
  @ViewChild(OlivePurchaseOrderManagerComponent)
  private manager: OlivePurchaseOrderManagerComponent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.setComponent();
  }

  get pageIcon() {
    return NavIcons.Purchase.PurchaseEntry;
  }

  get pageTitleId() {
    return NavTranslates.Purchase.PurchaseEntry;
  }
  
  setComponent() {
    this.route.data.subscribe(({ item }) => {
      if (item) {
        this.manager.item = item.model;
      }
    });
    this.manager.managePermission = null;
    this.manager.itemType = PurchaseOrder;
  }
}
