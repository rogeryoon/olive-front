import { FormGroup, FormControl } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { PurchaseOrderItem } from '../../../models/purchase-order-item.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator, requiredValidator } from 'app/core/validators/general-validators';
import { Currency } from 'app/main/supports/models/currency.model';
import { convertToBase26, convertBase26ToNumber } from 'app/core/utils/encode-helpers';
import { IdName } from 'app/core/models/id-name';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';

export class OlivePurchaseOrderItemDataSource extends TableDataSource {

    products: IdName[][] = [];
    isLoading = false;

    poCurrency: Currency = null;
    exchangeRate = 0;

    constructor(
        cacheService: OliveCacheService, private productService: OliveProductVariantService) { 
        super(cacheService); 
    }

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
        r.Obj.productVariantId = convertToBase26(r.Obj.productVariantId);
        const productVariantIdControl = new FormControl(r.Obj.productVariantId, [requiredValidator()]);
        productVariantIdControl.valueChanges.subscribe(val => { 
            if (val) {
                r.Obj.productVariantId = convertBase26ToNumber(val);
            }
            else {
                r.Obj.productVariantId = null;
            }
        });

        const fg = new FormGroup({
            productVariantId: productVariantIdControl,
            name: this.createNewFormControl(r, 'name', [requiredValidator()]),
            quantity: this.createNewFormControl(r, 'quantity', [numberValidator(0, true, 1)]),
            price: this.createNewFormControl(r, 'price', [numberValidator(this.standCurrency.decimalPoint, true)]),
            discount: this.createNewFormControl(r, 'discount', [numberValidator(this.standCurrency.decimalPoint, true)]),
            appliedCost: this.createNewFormControl(r, 'appliedCost', [numberValidator(this.standCurrency.decimalPoint, true)]),
            otherCurrencyPrice: this.createNewFormControl(r, 'otherCurrencyPrice', 
                [numberValidator(this.appliedCurrency.decimalPoint, this.otherCurrencyPriceRequired)]),
            remark: this.createNewFormControl(r, 'remark', [])
        });

        this.products.push([]);

        fg.get('name').valueChanges
        .pipe(
          debounceTime(300),
          tap(() => this.isLoading = true),
          switchMap(value => this.productService.search(value)
          .pipe(
            finalize(() => this.isLoading = false),
            )
          )
        )
        .subscribe(response => {
            this.products[this.products.length - 1] = response.model;
        });

        return fg;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}
