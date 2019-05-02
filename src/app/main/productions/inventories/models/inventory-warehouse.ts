
import { IdValue } from 'app/core/models/id-value';

export class InventoryWarehouse {
    id: number;
    productId: number;
    productName: string;
    productCode: string;
    variantName: string;
    totalQuantity: number;
    
    inventories?: IdValue[];

    selected?: boolean;
}
