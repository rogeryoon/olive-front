import { PermissionValues } from '@quick/models/permission.model';
import { OliveDataService } from './data-service';
import { NameValue } from '../models/name-value';

export interface IListerSetting {

    dataTableId?: string;    

    name: string;

    extraSearches?: NameValue[];
}

export class ListerSetting implements IListerSetting {

    dataTableId?: string;   

    name: string;

    columns?: any;

    extraSearches?: NameValue[];

    translateTitleId: string;

    icon: string;

    managePermission?: PermissionValues;
    
    editComponent?: any;

    searchComponent?: any;

    itemType: any;

    loadDetail?: boolean;

    // Dialog Title Overriding
    editCustomTitle?: string;

    // Datatable Order Overriding
    order?: any;

    isEditDialogReadOnly?: boolean;
}

export class LookupListerSetting implements IListerSetting {

    dataTableId?: string;   

    name: string;

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

    itemType?: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;
    // For New Item Support - End
}
