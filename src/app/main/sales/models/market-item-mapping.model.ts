import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { MarketItemMappingExcelColumn } from './market-item-mapping-excel-column.model';
import { MarketItemMappingProductVariant } from './market-item-mapping-product-variant.model';

export class MarketItemMapping extends OliveTrackingAttribute {
    id?: number;
    interfaceId?: number;
    interfaceName?: string;
    excelColumns?: MarketItemMappingExcelColumn[];
    products?: MarketItemMappingProductVariant[];
}
