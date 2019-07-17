import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/address.model';
import { DeliveryTag } from 'app/core/models/delivery-tag.model';
import { OrderShipOut } from './order-ship-out.model';

export class OrderShipOutPackage extends OliveTrackingAttribute {
    id?: number;
    deliveredDate?: any;
    signedBy?: string;
    deliveryTagId?: number;
    deliveryTagFk?: DeliveryTag;
    deliveryAddressId?: number;
    deliveryAddressFk?: Address;
    carrierTrackingId?: number;
    warehouseId?: number;
    orderCount?: number;
    orderShipOuts?: OrderShipOut[];
}
