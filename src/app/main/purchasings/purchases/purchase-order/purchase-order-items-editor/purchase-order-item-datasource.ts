import { FormGroup, Validators } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';

export class OlivePurchaseOrderItemDatasource extends TableDatasource {

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    init() {
        super.init();
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            name: this.createNewFormContorl(r, 'name', [Validators.required]),
            quantity: this.createNewFormContorl(r, 'quantity', [numberValidator(0, true, 1)]),
            price: this.createNewFormContorl(r, 'price', [numberValidator(this.standCurrency.decimalPoint, true)]),
            otherCurrencyPrice: this.createNewFormContorl(r, 'otherCurrencyPrice', [numberValidator(this.standCurrency.decimalPoint, false)]),
            remark: this.createNewFormContorl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}
