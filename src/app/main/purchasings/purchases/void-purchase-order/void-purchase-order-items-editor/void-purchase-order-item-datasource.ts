import { FormGroup } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { InWarehouseItem } from 'app/main/purchasings/in-warehouses/models/in-warehouse-item.model';

export class OliveVoidPurchaseOrderItemDatasource extends TableDatasource {

    poCurrency: Currency = null;

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    init() {
        super.init();
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            quantity: this.createNewFormContorl(r, 'quantity', [numberValidator(0, true, 1)]),
            remark: this.createNewFormContorl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new InWarehouseItem();
    }
}
