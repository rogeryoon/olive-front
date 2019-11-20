import { FormGroup } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { ProductCustomsTypeCode } from 'app/main/productions/models/product-customs-type-code.model';
import { customsTypeCodeValidator } from 'app/core/validators/customs-validators';

export class OliveProductCustomsTypeCodeDataSource extends TableDataSource {
    constructor(
        cacheService: OliveCacheService
    ) {
        super(cacheService);
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            customsTypeCode: this.createNewFormControl(r, 'customsTypeCode', [customsTypeCodeValidator(r.Obj.customsRules, true)])
        });
        return f;
    }

    createNewItem(): any {
        return new ProductCustomsTypeCode();
    }
}


