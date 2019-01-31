import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';

export class OlivePurchaseOrderItemDatasource extends TableDatasource {

    constructor() { super(); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            name: this.createNewFormContorl(r, 'name', [Validators.required] ),
            quantity: this.createNewFormContorl(r, 'quantity', [Validators.required, Validators.min(1)]),
            price: this.createNewFormContorl(r, 'price', [Validators.required, Validators.min(0.01)]),
            remark: this.createNewFormContorl(r, 'remark', [])
        });
        return f;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}

