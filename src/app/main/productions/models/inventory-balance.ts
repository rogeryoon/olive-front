export class InventoryBalance {
    id: number;
    shortId: number; 
    productId: number;
    productName: string;
    productCode: string;
    variantName: string;
    totalQuantity: number;
    inTransitQuantity: number;
    standPrice: number;
    priceDue: number;
    
    selected?: boolean;
}
