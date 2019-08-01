import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class OrderShipOutDetail extends OliveTrackingAttribute {
    id?: number;
    cost?: number;
    soldPrice?: number;
    quantity?: number;
    productId?: number;
    productVariantId?: number;
    productVariantShortId?: number;
    name?: string;
    kiloGramWeight?: number;
    customsPrice?: number;
    volume?: string;
    hsCode?: string;
}
