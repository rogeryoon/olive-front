import { FormGroup } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { OliveCacheService } from 'app/core/services/cache.service';
import { subsetValidator } from 'app/core/classes/validators';
import { MarketItemMappingExcelColumn } from '../../../models/market-item-mapping-excel-column.model';

export class OliveMarketItemMappingExcelColumnDatasource extends TableDatasource {

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            matchValue: this.createNewFormContorl(r, 'matchValue', [subsetValidator(`${r.Obj.originalValue}`)]),
            matchSearch: this.createNewFormContorl(r, 'matchSearch', null, r.Obj.readOnly)
        }, );
        return f;
    }

    public createNewItem(): any {
        return new MarketItemMappingExcelColumn();
    }
}


