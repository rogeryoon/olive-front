import { FormGroup } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { requiredValidator } from 'app/core/classes/validators';
import { ProductHsCode } from 'app/main/productions/models/product-hs-code.model';

export class OliveProductHsCodeDataSource extends TableDataSource {

    constructor(
        cacheService: OliveCacheService
    ) {
        super(cacheService);
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            hsCode: this.createNewFormControl(r, 'hsCode', [requiredValidator()])
        });
        return f;
    }

    createNewItem(): any {
        return new ProductHsCode();
    }
}


