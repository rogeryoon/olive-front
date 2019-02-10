import { Component, OnInit } from '@angular/core';

import { OliveOnPreview } from 'app/core/interfaces/on-preview';

@Component({
  selector: 'olive-preview-purchase-order',
  templateUrl: './preview-purchase-order.component.html',
  styleUrls: ['./preview-purchase-order.component.scss']
})
export class OlivePreviewPurchaseOrderComponent implements OnInit, OliveOnPreview {
  data: any;

  constructor() { }

  ngOnInit() {
  }

  onPrint() {

  }
}
