import { PermissionValues } from '@quick/models/permission.model';
import { OliveDataService } from './data-service';
import { DeviceDetectorService } from 'ngx-device-detector';

export interface IListerSetting {

    dataTableId?: string;    

    name: string;

    columns?: any;
}

export class ListerSetting implements IListerSetting {

    dataTableId?: string;   

    name: string;

    columns?: any;

    translateTitleId: string;

    icon: string;

    managePermission?: PermissionValues;
    
    editComponent?: any;

    searchComponent?: any;

    itemType: any;

    loadDetail?: boolean;
}

export class LookupListerSetting implements IListerSetting {

    dataTableId?: string;   

    name: string;

    columns?: any;

    dialogTitle: string;

    dataService: OliveDataService;

    renderCallback?: any;

    maxSelectItems: number;

    // For New Item Support - Start
    newComponent?: any;

    itemType?: any;

    managePermission?: PermissionValues;

    translateTitleId?: string;
    // For New Item Support - End
}
