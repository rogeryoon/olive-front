import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class InWarehouseItem extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    balance?: number;
    purchaseOrderItemId?: number;
    inWarehouseId?: number;

    name?: string;    
    originalBalance?: number;
    price?: number;
    vendorName?: string;
    productVariantId?: number;
}
