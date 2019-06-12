import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Product } from './product.model';

export class ProductVariant extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    standPrice?: number;
    weight?: number;
    weightTypeCode: string;
    volume?: string;
    lengthTypeCode: string;
    activated?: boolean;
    memo: string;

    productId?: number;
    productFk?: Product;
}
