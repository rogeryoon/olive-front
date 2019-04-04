import { PermissionValues } from '@quick/models/permission.model';
export interface OliveOnEdit {

    item: any;

    managePermission?: PermissionValues;

    itemType: any;

    customTitle?: string;

    translateTitleId?: string;

    startTabIndex?: number;

    readOnly?: boolean;

    itemSaved$: any;

    itemDeleted$: any;

    save(): void;

    delete(): void;

    canSave(): boolean;
}
