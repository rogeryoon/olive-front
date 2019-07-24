import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class OrderShipOutDetail extends OliveTrackingAttribute {
    id?: number;
    cost?: number;
    soldPrice?: number;
    quantity?: number;
    productId?: number;
    productVariantId?: number;
    productVariantShortId?: number;
    kiloGramWeight?: number;
    customsPrice?: number;
    name?: string;
}
