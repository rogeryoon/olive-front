import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Market } from './market.model';

export class MarketSeller extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    memo: string;
    activated?: boolean;
    marketId?: number;
    marketFk?: Market;
}
