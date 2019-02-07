import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { ProductVariant } from 'app/main/productions/products/models/product-variant.model';

export class PurchaseOrderItem extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    price?: number;
    appliedCost?: number;
    otherCurrencyPrice?: number;
    remarks: string;
    productVariantId?: number;
    name: string;
}
