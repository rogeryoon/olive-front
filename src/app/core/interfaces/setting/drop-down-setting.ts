import { IListerSetting } from './lister-setting';
import { NameValue } from 'app/core/models/name-value';
import { OliveDataService } from '../data-service';

export class DropDownSetting implements IListerSetting {
    itemType: any;    
    
    extraSearches?: NameValue[];

    required: boolean;

    dataService?: OliveDataService;
}
