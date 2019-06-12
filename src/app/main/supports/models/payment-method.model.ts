import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
// import { Company } from './company.model';

export class PaymentMethod extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    memo: string;
    activated?: boolean;
}
