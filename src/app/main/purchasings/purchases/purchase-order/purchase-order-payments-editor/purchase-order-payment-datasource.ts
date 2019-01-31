import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PurchaseOrderPayment } from '../../models/purchase-order-payment.model';
import { TableDatasource } from 'app/core/classes/table-datasource';

export class OlivePurchaseOrderPaymentDatasource extends TableDatasource {

    constructor() { super(); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            paymentMethodId: this.createNewFormContorl(r, 'paymentMethodId', [Validators.required]),
            amount: this.createNewFormContorl(r, 'amount', [Validators.required, Validators.min(0.01)]),
            remarkId: this.createNewFormContorl(r, 'remarkId', [])
        });
        return f;
    }

    createNewFormContorl(r: any, propName: string, validators: any[]): FormControl {
        const m = super.createNewFormContorl(r, propName, validators);
        if (r.Obj.paymentMethodId && propName === 'paymentMethodId') { m.setValue(r.Obj.paymentMethodId); }
        return m;
    }

    public createNewItem(): any {
        return new PurchaseOrderPayment();
    }
}


