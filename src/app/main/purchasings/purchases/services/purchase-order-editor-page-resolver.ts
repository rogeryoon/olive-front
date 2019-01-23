import { Injectable } from '@angular/core';

import { OlivePurchaseOrderService } from './purchase-order.service';
import { OliveEntityResolverService } from 'app/core/services/entity-resolver.service';

@Injectable()
export class OlivePurchaseOrderEditorPageResolver extends OliveEntityResolverService {
    constructor(dataService: OlivePurchaseOrderService) { super(dataService); }
}


