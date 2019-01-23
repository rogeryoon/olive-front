import { InventoryWarehouseUnit } from './inventory-warehouse-unit';

export class InventoryWarehouse {
    variantId: number;
    productId: number;
    productName: string;
    productCode: string;
    variantName: string;
    stockQtyDue: number;
    
    inventories?: InventoryWarehouseUnit[];

    selected?: boolean;
}
