import { FormGroup, Validators } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';
import { Currency } from 'app/main/supports/bases/models/currency.model';

export class OlivePurchaseOrderItemDatasource extends TableDatasource {

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
            name: this.createNewFormContorl(r, 'name', [Validators.required]),
            quantity: this.createNewFormContorl(r, 'quantity', [numberValidator(0, true, 1)]),
            price: this.createNewFormContorl(r, 'price', [numberValidator(this.standCurrency.decimalPoint, true)]),
            discount: this.createNewFormContorl(r, 'discount', [numberValidator(this.standCurrency.decimalPoint, true)]),
            appliedCost: this.createNewFormContorl(r, 'appliedCost', [numberValidator(this.standCurrency.decimalPoint, true)]),
            otherCurrencyPrice: this.createNewFormContorl(r, 'otherCurrencyPrice', 
                [numberValidator(this.appliedCurrency.decimalPoint, this.otherCurrencyPriceRequired)]),
            remark: this.createNewFormContorl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}
