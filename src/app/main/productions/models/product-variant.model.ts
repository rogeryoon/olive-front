import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Product } from './product.model';

export class ProductVariant extends OliveTrackingAttribute {
    id?: number;
    code: string;
    shortId: number;
    name: string;
    standPrice?: number;
    weight?: number;
    weightTypeCode: string;
    volume?: string;
    lengthTypeCode: string;
    customsName?: string;
    customsPrice?: number;
    customsTypeCode: string;
    hsCode: string;
    activated?: boolean;
    memo: string;

    productId?: number;
    productFk?: Product;
}
