import { IListerSetting } from './lister-setting';
import { OliveDataService } from '../data-service';
import { PermissionValues } from '@quick/models/permission.model';

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
