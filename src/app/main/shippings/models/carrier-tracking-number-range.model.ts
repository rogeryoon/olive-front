import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class CarrierTrackingNumberRange extends OliveTrackingAttribute {
    id?: number;
    name: string;
    memo: string;
    fromTrackingNumber?: number;
    toTrackingNumber?: number;
    lastTrackingNumber?: number;
    activated?: boolean;
    branchId?: number;
    branchName?: string;
    branchCode?: string;
    carrierId?: number;
    carrierName?: string;
    carrierCode?: string;
    companyGroupId?: number;
    companyGroupName?: string;
}
