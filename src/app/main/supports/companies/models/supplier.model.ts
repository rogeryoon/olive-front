import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Supplier extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    phoneNumber: string;
    email: string;
    webSite: string;
    address: string;
    memo: string;
    activated?: boolean;
}
