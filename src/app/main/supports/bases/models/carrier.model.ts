import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Carrier extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    webSite: string;
    memo: string;
    activated?: boolean;
    standCarrierId?: string;
}
