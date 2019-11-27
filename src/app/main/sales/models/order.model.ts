import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { MarketSeller } from 'app/main/supports/models/market-seller.model';
import { OrderOriginalDetail } from './order-original-detail.model';

export class Order extends OliveTrackingAttribute {
    id?: number;
    marketOrderNumber: string;
    marketOrdererName: string;
    marketSellerName: string;
    marketOrderDate?: any;
    marketOrderDescription: string;
    memo: string;    
    itemsChanged?: boolean;
    marketSellerFk?: MarketSeller;
    orderOriginalDetails?: OrderOriginalDetail[];
}
