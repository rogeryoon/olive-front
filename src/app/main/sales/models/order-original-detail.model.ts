import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { SimpleProduct } from 'app/main/productions/models/simple-product.model';

export class OrderOriginalDetail extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    product?: SimpleProduct;
}
