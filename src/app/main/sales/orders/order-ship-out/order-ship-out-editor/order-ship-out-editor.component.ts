import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Order } from 'app/main/sales/models/order.model';
import { showEventDateAndName, getShortDate } from 'app/core/utils/date-helper';

@Component({
  selector: 'olive-order-ship-out-editor',
  templateUrl: './order-ship-out-editor.component.html',
  styleUrls: ['./order-ship-out-editor.component.scss']
})
export class OliveOrderShipOutEditorComponent extends OliveEntityFormComponent {
  readOnly = true;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedOrder(): Order {
    const formModel = this.oFormValue;
    const order = ((this.item) as OrderShipOut).orderFk;
    order.memo = formModel.memo;
    return order;
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      status: '',
      canceledUser: '',
      marketOrderNumber: '',
      marketSellerCode: '',
      marketOrdererName: '',
      marketOrderDate: '',
      marketOrderDescription: '',
      memo: ''
    });
  }

  resetForm() {
    const item = this.item as OrderShipOut;

    this.oForm.reset({
      status: this.statusTitle || '',
      canceledUser: item.canceledUser || '',
      marketOrderNumber: item.orderFk.marketOrderNumber || '',
      marketSellerCode: item.orderFk.marketSellerFk.code || '',
      marketOrdererName: item.orderFk.marketOrdererName || '',
      marketOrderDate: item.orderFk.marketOrderDate || '',
      marketOrderDescription: item.orderFk.marketOrderDescription || '',
      memo: item.orderFk.memo || ''
    });

    if (item.canceledDate) {
      const userNameKeys: string[] = [item.canceledUser];

      this.cacheService.getUserNames(userNameKeys)
          .then(userNames => {
            if (userNames.length > 0) {
              this.oForm.patchValue({canceledUser: showEventDateAndName(item.canceledDate, userNames[0])});
            }
            else {
              this.oForm.patchValue({canceledUser: getShortDate(item.canceledDate)});
            }
          });
    }
  }

  createEmptyObject() {
    return new OrderShipOut();
  }

  get statusTitle() {
    const item = this.item as OrderShipOut;

    if (!item) {
      return '';
    }

    let status1;

    if (item.canceledDate) {
      status1 = this.translator.get('common.status.canceled');
    }
    else if (item.shipOutDate) {
      status1 = this.translator.get('common.status.shipped');
    }
    else {
      status1 = this.translator.get('common.status.pending');
    }

    let status2 = null;

    if (item.orderFk.itemsChanged) {
      status2 = this.translator.get('common.status.itemChanged');
    }

    return status2 ? `${status1} - [${status2}]` : status1;
  }

  get statusColor(): string {
    if (!this.item) {
      return '';
    }

    if (this.item.canceledDate) {
      return 'red';
    }
    else if (this.item.shipOutDate) {
      return 'blue';
    }
    else {
      return 'orange';
    }
  }
}
