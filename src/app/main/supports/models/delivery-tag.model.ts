import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class DeliveryTag extends OliveTrackingAttribute {
    id?: number;
    buyerCellPhoneNumber: string;
    consigneeCellPhoneNumber: string;
    consigneePhoneNumber2: string;
    customsName: string;
    customsId: string;
    consigneeName: string;
    deliveryMemo: string;
}
