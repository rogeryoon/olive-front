import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/core/address.model';
import { DeliveryTag } from 'app/main/supports/models/delivery-tag.model';
import { OrderShipOutDetail } from './order-ship-out-detail.model';
import { Order } from './order.model';

export class OrderShipOut extends OliveTrackingAttribute {
    id?: number;
    shipOutDate?: any;
    canceledDate?: any;
    canceledUser: string;
    deliveryTagFk?: DeliveryTag;
    deliveryAddressFk?: Address;
    orderFk?: Order;
    orderShipOutDetails?: OrderShipOutDetail[];
}
