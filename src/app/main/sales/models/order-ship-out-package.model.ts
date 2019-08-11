import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/address.model';
import { DeliveryTag } from 'app/core/models/delivery-tag.model';
import { OrderShipOut } from './order-ship-out.model';
import { OrderShipOutPackageExtra } from './order-ship-out-package-extra.model';

export class OrderShipOutPackage extends OliveTrackingAttribute {
    id?: number;
    deliveredDate?: any;
    signedBy?: string;
    extra?: OrderShipOutPackageExtra;
    deliveryTagId?: number;
    deliveryTagFk?: DeliveryTag;
    deliveryAddressId?: number;
    deliveryAddressFk?: Address;
    carrierTrackingId?: number;
    trackingNumber?: string;
    warehouseId?: number;
    orderCount?: number;
    orderShipOuts?: OrderShipOut[];
}
