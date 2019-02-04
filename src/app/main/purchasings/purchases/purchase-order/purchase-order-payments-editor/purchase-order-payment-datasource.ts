import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PurchaseOrderPayment } from '../../models/purchase-order-payment.model';
import { TableDatasource } from 'app/core/classes/table-datasource';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';
export class OlivePurchaseOrderPaymentDatasource extends TableDatasource {

    amountRegexPattern: string;

    constructor(cacheService: OliveCacheService) { super(cacheService); }

    createRowFormGroup(r: any): FormGroup {
        const f = new FormGroup({
            paymentMethodId: this.createNewFormContorl(r, 'paymentMethodId', [Validators.required]),
            amount: this.createNewFormContorl(r, 'amount', [numberValidator(this.standCurrency.decimalPoint, true)]),
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


