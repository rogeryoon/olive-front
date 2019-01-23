import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TableDatasource } from 'app/core/classes/table-datasource';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';

export class OlivePurchaseOrderItemDatasource extends TableDatasource {

    constructor() { super(); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            name: this.createNewFormContorl(r, 'name', true),
            quantity: this.createNewFormContorl(r, 'quantity', true),
            price: this.createNewFormContorl(r, 'price', true),
            remark: this.createNewFormContorl(r, 'remark', false)
        });
        return f;
    }

    createNewFormContorl(r: any, propName: string, required: boolean): FormControl {
        const m = new FormControl(r.Obj[propName], required ? Validators.required : null);
        m.valueChanges.subscribe(val => { r.Obj[propName] = val; });
        return m;
    }

    public createNewItem(): any {
        return new PurchaseOrderItem();
    }
}

