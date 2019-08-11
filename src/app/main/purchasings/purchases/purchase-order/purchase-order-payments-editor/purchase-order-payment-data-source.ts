import { FormGroup, FormControl } from '@angular/forms';

import { PurchaseOrderPayment } from '../../../models/purchase-order-payment.model';
import { TableDataSource } from 'app/core/classes/table-data-source';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator, requiredValidator } from 'app/core/classes/validators';
export class OlivePurchaseOrderPaymentDataSource extends TableDataSource {
    constructor(cacheService: OliveCacheService) { 
        super(cacheService); 
    }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            paymentMethodId: this.createNewFormControl(r, 'paymentMethodId', [requiredValidator()]),
            amount: this.createNewFormControl(r, 'amount', [numberValidator(this.standCurrency.decimalPoint, true)]),
            remarkId: this.createNewFormControl(r, 'remarkId', [])
        });
        return f;
    }

    createNewFormControl(r: any, propName: string, validators: any[]): FormControl {
        const m = super.createNewFormControl(r, propName, validators);
        if (r.Obj.paymentMethodId && propName === 'paymentMethodId') { m.setValue(r.Obj.paymentMethodId); }
        return m;
    }

    public createNewItem(): any {
        return new PurchaseOrderPayment();
    }
}


