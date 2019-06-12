import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { StandCarrier } from './stand-carrier.model';

export class Carrier extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    webSite: string;
    memo: string;
    activated?: boolean;
    standCarrierId?: string;
    standCarrierFk?: StandCarrier;
}
