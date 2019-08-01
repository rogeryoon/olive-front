import { FormGroup } from '@angular/forms';

import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { subsetValidator } from 'app/core/classes/validators';
import { MarketItemMappingExcelColumn } from '../../../models/market-item-mapping-excel-column.model';

export class OliveMarketItemMappingExcelColumnDataSource extends TableDataSource {

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            matchValue: this.createNewFormControl(r, 'matchValue', [subsetValidator(`${r.Obj.originalValue}`)]),
            matchSearch: this.createNewFormControl(r, 'matchSearch', null, r.Obj.readOnly)
        }, );
        return f;
    }

    public createNewItem(): any {
        return new MarketItemMappingExcelColumn();
    }
}


