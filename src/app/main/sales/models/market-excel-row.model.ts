import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class MarketExcelRow extends OliveTrackingAttribute {
    id?: number;
    orderNumber?: string;
    consigneeName?: string;
    productName?: string;
    quantity?: number;
    marketItemMappingId?: number;
    orderId?: number;
    duplicatedOrder?: boolean;
    data?: string;
}
