import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class CarrierTrackingEntry extends OliveTrackingAttribute {
    trackingNumber: string;
    oldTrackingNumber?: string;
    carrierId?: number;
    carrierBranchId?: number;
}
