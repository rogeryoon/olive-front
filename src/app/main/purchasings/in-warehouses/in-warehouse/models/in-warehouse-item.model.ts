import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { ProductVariant } from 'app/main/productions/products/models/product-variant.model';
import { PurchaseOrder } from 'app/main/purchasings/purchases/models/purchase-order.model';

export class InWarehouseItem extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    balance?: number;
    name?: string;
    productVariantId?: number;
    purchaseOrderFk?: PurchaseOrder;
    originalBalance?: number;
}
