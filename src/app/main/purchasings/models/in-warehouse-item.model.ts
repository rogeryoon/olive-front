import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class InWarehouseItem extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    balance?: number;
    purchaseOrderItemId?: number;
    inWarehouseId?: number;

    productVariantId?: number;    
    name?: string;    
    originalBalance?: number;
    price?: number;
    supplierName?: string;
    purchaseOrderId?: number;
    purchaseOrderDate?: any;
}
