import { OliveTrackingAttribute } from '../classes/tracking-attribute';

export class CompanyGroupSetting extends OliveTrackingAttribute {
    id?: number;
    purchasingEnabled?: boolean;
    thirdpartyEnabled?: boolean;
    shippingAgentEnabled?: boolean;
    productWeightTypeCode: string;
}
