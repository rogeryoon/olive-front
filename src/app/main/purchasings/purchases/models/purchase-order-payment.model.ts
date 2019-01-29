import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class PurchaseOrderPayment extends OliveTrackingAttribute {
    id?: number;
    code?: string;
    remarkId: string;
    amount?: number;
    paymentMethodId?: number;
}
