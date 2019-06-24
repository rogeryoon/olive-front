import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

import { FormGroup, Validators, FormControl } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';
import { IdName } from 'app/core/models/id-name';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OrderShipOutDetail } from 'app/main/sales/models/order-ship-out-detail.model';

export class OliveOrderShipOutDetailDatasource extends TableDatasource {

    products: IdName[][] = [];
    isLoading = false;

    constructor(
        cacheService: OliveCacheService, private productService: OliveProductVariantService
    ) {
        super(cacheService);
    }

    createRowFormGroup(r: any): FormGroup {
        r.Obj.productVariantId36 = OliveUtilities.convertToBase36(r.Obj.productVariantId);
        const productVariantId36Control = new FormControl(r.Obj.productVariantId36, [Validators.required]);
        productVariantId36Control.valueChanges.subscribe(val => { 
            if (val) {
                r.Obj.productVariantId = OliveUtilities.convertBase36ToNumber(val);
            }
            else {
                r.Obj.productVariantId = null;
            }
        });

        const fg = new FormGroup({
            productVariantId36: productVariantId36Control,
            productName: this.createNewFormContorl(r, 'name', [Validators.required]),
            quantity: this.createNewFormContorl(r, 'quantity', [numberValidator(0, true, 1)])
        });

        this.products.push([]);

        fg.get('productName').valueChanges
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

    createNewItem(): any {
        return new OrderShipOutDetail();
    }

    onReInitialize() {
        this.products = [];
    }
}


