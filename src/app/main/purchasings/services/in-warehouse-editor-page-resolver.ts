import { Injectable } from '@angular/core';

import { OliveInWarehouseService } from './in-warehouse.service';
import { OliveEntityResolverService } from 'app/core/services/entity-resolver.service';

@Injectable({
    providedIn: 'root'
})
export class OliveInWarehouseEditorPageResolver extends OliveEntityResolverService {
    constructor(dataService: OliveInWarehouseService) { super(dataService); }
}


