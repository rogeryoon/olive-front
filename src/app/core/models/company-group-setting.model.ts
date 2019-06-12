import { OliveTrackingAttribute } from '../classes/tracking-attribute';

export class CompanyGroupSetting extends OliveTrackingAttribute {
    id?: number;
    purchasingEnabled?: boolean;
    thirdPartyEnabled?: boolean;
    shippingAgentEnabled?: boolean;
    productWeightTypeCode: string;
    productLengthTypeCode: string;
}
