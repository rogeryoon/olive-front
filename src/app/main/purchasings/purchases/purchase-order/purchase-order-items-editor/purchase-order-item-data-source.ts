import { FormGroup, Validators } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { PurchaseOrderItem } from '../../../models/purchase-order-item.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';
import { Currency } from 'app/main/supports/models/currency.model';

export class OlivePurchaseOrderItemDataSource extends TableDataSource {

    poCurrency: Currency = null;
    exchangeRate = 0;

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    init() {
        super.init();
    }

    get otherCurrencyPriceRequired() {
        return !this.appliedCurrency.primary && this.exchangeRate > 0;
    }

    get appliedCurrency(): Currency {
        return this.poCurrency === null ? this.standCurrency : this.poCurrency;
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            name: this.createNewFormControl(r, 'name', [Validators.required]),
            quantity: this.createNewFormControl(r, 'quantity', [numberValidator(0, true, 1)]),
            price: this.createNewFormControl(r, 'price', [numberValidator(this.standCurrency.decimalPoint, true)]),
            discount: this.createNewFormControl(r, 'discount', [numberValidator(this.standCurrency.decimalPoint, true)]),
            appliedCost: this.createNewFormControl(r, 'appliedCost', [numberValidator(this.standCurrency.decimalPoint, true)]),
            otherCurrencyPrice: this.createNewFormControl(r, 'otherCurrencyPrice', 
                [numberValidator(this.appliedCurrency.decimalPoint, this.otherCurrencyPriceRequired)]),
            remark: this.createNewFormControl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}
