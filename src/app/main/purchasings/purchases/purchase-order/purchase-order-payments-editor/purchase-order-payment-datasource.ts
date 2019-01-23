import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PurchaseOrderPayment } from '../../models/purchase-order-payment.model';
import { TableDatasource } from 'app/core/classes/table-datasource';

export class OlivePurchaseOrderPaymentDatasource extends TableDatasource {

    constructor() { super(); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            paymentMethodId: this.createNewFormContorl(r, 'paymentMethodId', true),
            amount: this.createNewFormContorl(r, 'amount', true),
            remarkId: this.createNewFormContorl(r, 'remarkId', false)
        });
        return f;
    }

    createNewFormContorl(r: any, propName: string, required: boolean): FormControl {
        const m = new FormControl(r.Obj[propName], required ? Validators.required : null);
        if (r.Obj.paymentMethodId && propName === 'paymentMethodId') { m.setValue(r.Obj.paymentMethodId); }
        m.valueChanges.subscribe(val => { r.Obj[propName] = val; });
        return m;
    }

    public createNewItem(): any {
        return new PurchaseOrderPayment();
    }
}


