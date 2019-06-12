import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class CarrierTracking extends OliveTrackingAttribute {
    id?: number;
    trackingNumber: string;
    delivered?: boolean;
    signedBy: string;
    carrierId?: number;
}
