import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/address.model';
import { DeliveryTag } from 'app/core/models/delivery-tag.model';
import { OrderShipOutDetail } from './order-ship-out-detail.model';
import { Order } from './order.model';

export class OrderShipOut extends OliveTrackingAttribute {
    id?: number;
    shipOutDate?: any;
    canceledDate?: any;
    canceledUser: string;
    deliveryTagId?: number;
    deliveryTagFk?: DeliveryTag;
    deliveryAddressId?: number;
    deliveryAddressFk?: Address;
    orderFk?: Order;
    orderShipOutDetails?: OrderShipOutDetail[];

    trackingNumber?: string;
    oldTrackingNumber?: string;
    carrierId?: number;
    carrierBranchId?: number;

    dupAddressName?: string;
    combinedShipAddressName?: string;
    combinedShipAddressIsPrimary?: boolean;

    choices?: boolean[];
}
