import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class CompanyMaster extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    purchasingEnabled?: boolean;
    thirdpartyEnabled?: boolean;
    shippingAgentEnabled?: boolean;
    shippingEnabled?: boolean;
    currencyCode: string;
}
