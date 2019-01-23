import { IdName } from '../models/id-name';

export interface OliveOnLookUp {
    data?: any;
    oliveOnLookUp(): IdName[];
}
