import { IdName } from '../models/id-name';

export interface OliveOnSearch {
    data?: any;
    onSearch(): IdName[];
}
