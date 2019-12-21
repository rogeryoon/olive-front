import { IListerSetting } from './lister-setting';
import { NameValue } from 'app/core/models/name-value';
import { OliveDataService } from '../data-service';
import { PermissionValues } from '@quick/models/permission.model';

export class LookupListerSetting implements IListerSetting {

    dataTableId?: string;   

    itemType: any;

    columnType?: string;

    disableSearchInput?: boolean;

    trMouseCursor?: string;

    customClick?: boolean;

    searchOption?: any;

    searchPlaceHolderName?: string;

    itemTitle: string;

    dataService: OliveDataService;

    renderCallback?: any;

    maxSelectItems?: number;

    maxNameLength?: number;

    currentItem?: any;

    // For New Item Support - Start
    newComponent?: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;
    // For New Item Support - End

    extra?: any;
}
