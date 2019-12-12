import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

import { FormGroup, FormControl } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator, requiredValidator } from 'app/core/validators/general-validators';
import { MarketItemMappingProductVariant } from '../../../models/market-item-mapping-product-variant.model';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';
import { IdName } from 'app/core/models/id-name';
import { convertToBase26, convertBase26ToNumber } from 'app/core/utils/encode-helpers';

export class OliveMarketItemMappingProductVariantDataSource extends TableDataSource {

    products: IdName[][] = [];
    isLoading = false;

    constructor(
        cacheService: OliveCacheService, private productService: OliveProductVariantService
    ) {
        super(cacheService);
    }

    createRowFormGroup(r: any): FormGroup {
        r.Obj.productVariantId26 = convertToBase26(r.Obj.productVariantId);
        const productVariantId26Control = new FormControl(r.Obj.productVariantId26, [requiredValidator()]);
        productVariantId26Control.valueChanges.subscribe(val => { 
            if (val) {
                r.Obj.productVariantId = convertBase26ToNumber(val);
            }
            else {
                r.Obj.productVariantId = null;
            }
        });

        const fg = new FormGroup({
            productVariantId26: productVariantId26Control,
            productName: this.createNewFormControl(r, 'productName', [requiredValidator()]),
            quantity: this.createNewFormControl(r, 'quantity', [numberValidator(0, true, 1)])
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
        return new MarketItemMappingProductVariant();
    }

    onReInitialize() {
        this.products = [];
    }
}


