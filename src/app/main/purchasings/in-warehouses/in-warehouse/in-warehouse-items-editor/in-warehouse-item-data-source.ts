import { FormGroup } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/validators/general-validators';
import { Currency } from 'app/main/supports/models/currency.model';
import { InWarehouseItem } from '../../../models/in-warehouse-item.model';

export class OliveInWarehouseItemDataSource extends TableDataSource {

    poCurrency: Currency = null;

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    init() {
        super.init();
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            quantity: this.createNewFormControl(r, 'quantity', [numberValidator(0, true, 1)]),
            remark: this.createNewFormControl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new InWarehouseItem();
    }
}
