import { PermissionValues } from '@quick/models/permission.model';
import { OliveDataService } from './data-service';
import { NameValue } from '../models/name-value';

export interface IListerSetting {

    itemType: any;
}

export class ListerSetting implements IListerSetting {

    dataTableId?: string;   

    itemType: any;

    extraSearches?: NameValue[];

    columns?: any[];

    translateTitleId: string;

    icon: string;

    managePermission?: PermissionValues;
    
    editComponent?: any;

    searchComponent?: any;

    loadDetail?: boolean;

    // Dialog Title Overriding
    editCustomTitle?: string;

    // Datatable Order Overriding
    order?: any;

    isEditDialogReadOnly?: boolean;

    footerColumns?: any[];

    disabledContextMenus?: string[];
}

export class LookupListerSetting implements IListerSetting {

    dataTableId?: string;   

    itemType: any;

    columnType?: string;

    disableSearchInput?: boolean;

    trMouseCursor?: string;

    customClick?: boolean;

    extraSearches?: NameValue[];

    dialogTitle: string;

    dataService: OliveDataService;

    renderCallback?: any;

    maxSelectItems?: number;

    maxNameLength?: number;

    // For New Item Support - Start
    newComponent?: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;
    // For New Item Support - End
}

export class DropDownSetting implements IListerSetting {
    itemType: any;    
    
    extraSearches?: NameValue[];

    required: boolean;

    dataService?: OliveDataService;
}

export class ReferHostSetting implements IListerSetting {
    itemType: any;

    dataService: OliveDataService;

    managerComponent: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;

    customTitleTemplate?: string;

    customTitleCallback?: any;

    customNameCallback?: any;

    readonly: boolean;
}
