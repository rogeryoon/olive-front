import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class OrderOriginalDetail extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    productId?: number;
    productVariantId?: number;
    productName?: string;
}
