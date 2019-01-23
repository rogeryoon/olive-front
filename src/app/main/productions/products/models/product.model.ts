import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { ProductVariant } from './product-variant.model';
import { IdName } from 'app/core/models/id-name';

export class Product extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    activated?: boolean;
    memo: string;
    hsCode: string;

    companyGroupId?: number;

    brands?: IdName[];
    categories?: IdName[];
    tags?: IdName[];
    variants?: ProductVariant[];

    loadDetail?: boolean;
}
