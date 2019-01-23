export class InventoryBalance {
    variantId: number;
    productId: number;
    productName: string;
    productCode: string;
    variantName: string;
    totalQty: number;
    orderedQty?: number;
    standPrice?: number;
    priceDue?: number;
    
    selected?: boolean;
}
