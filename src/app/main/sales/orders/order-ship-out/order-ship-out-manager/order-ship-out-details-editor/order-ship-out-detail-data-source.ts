import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

import { FormGroup, FormControl } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator, requiredValidator } from 'app/core/validators/general-validators';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';
import { OrderShipOutDetail } from 'app/main/sales/models/order-ship-out-detail.model';
import { convertToBase26, convertBase26ToNumber } from 'app/core/utils/encode-helpers';
import { ProductVariantPrice } from 'app/main/productions/models/product-variant-price.model';
import { Observable } from 'rxjs';

export class OliveOrderShipOutDetailDataSource extends TableDataSource {

    products: ProductVariantPrice[][] = [];
    isLoading = false;

    constructor(
        cacheService: OliveCacheService, private productService: OliveProductVariantService
    ) {
        super(cacheService);
    }

    createRowFormGroup(r: any): FormGroup {
        r.Obj.productVariantId26 = convertToBase26(r.Obj.productVariantShortId);
        const productVariantId26Control = new FormControl(r.Obj.productVariantId26, [requiredValidator()]);
        productVariantId26Control.valueChanges.subscribe(val => { 
            if (val) {
                r.Obj.productVariantShortId = convertBase26ToNumber(val);
            }
            else {
                r.Obj.productVariantShortId = null;
            }
        });

        const fg = new FormGroup({
            productVariantId26: productVariantId26Control,
            hiddenProductVariantId: this.createNewFormControl(r, 'productVariantId', []),
            productName: this.createNewFormControl(r, 'productName', [requiredValidator()]),
            quantity: this.createNewFormControl(r, 'quantity', [numberValidator(0, true, 1)])
        });

        this.products.push([]);

        setTimeout(() => {
            fg.get('productName').valueChanges
            .pipe(
              debounceTime(500),
              tap(() => this.isLoading = true),
              switchMap((value: string) => (value.trim().length > 1 ? this.productService.search(value) : Observable.of({model: []}))
              .pipe(
                finalize(() => this.isLoading = false),
                )
              )
            )
            .subscribe(response => {
                this.products[this.products.length - 1] = response.model;
            });
        }, 200);

        return fg;
    }

    createNewItem(): any {
        return new OrderShipOutDetail();
    }

    onReInitialize() {
        this.products = [];
    }
}


