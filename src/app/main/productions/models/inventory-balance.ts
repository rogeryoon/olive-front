export class InventoryBalance {
    // Viriant ID
    id: number; 
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
