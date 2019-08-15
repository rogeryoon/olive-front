import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { OrderShipOutDetailExtra } from './order-ship-out-detail-extra.model';

export class OrderShipOutDetail extends OliveTrackingAttribute {
    id?: number;
    cost?: number;
    soldPrice?: number;
    quantity?: number;
    extra?: OrderShipOutDetailExtra;
    productId?: number;
    productVariantId?: number;
    productVariantShortId?: number;
    name?: string;
    customsTypeCode?: string;
    kiloGramWeight?: number;
    customsPrice?: number;
    volume?: string;
    hsCode?: string;
}
