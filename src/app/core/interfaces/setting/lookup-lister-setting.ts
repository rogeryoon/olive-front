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

    lookUpDialogComponent?: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;
    // For New Item Support - End

    extra1?: any;

    extra2?: any;
}
