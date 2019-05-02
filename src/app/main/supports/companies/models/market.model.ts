import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { StandMarket } from './stand-market';

export class Market extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    phoneNumber: string;
    email: string;
    webSite: string;
    memo: string;
    activated?: boolean;
    companyGroupId: number;
    standMarketId: number;
    standMarketFk?: StandMarket;
}
