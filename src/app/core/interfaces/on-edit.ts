import { PermissionValues } from '@quick/models/permission.model';
import { OliveOnButton } from './on-buttons';
export interface OliveOnEdit {

    item: any;

    managePermission?: PermissionValues;

    itemType: any;

    customTitle?: string;

    startTabIndex?: number;

    readOnly?: boolean;

    isSaving?: boolean;

    isDeleting?: boolean;

    itemSaved$: any;

    itemDeleted$: any;

    hideDelete?: boolean;

    save(): void;

    delete(): void;

    canSave(): boolean;

    canDelete(): boolean;

    customButtonActionEnded$: any;    

    customButtons?: OliveOnButton[];    

    customButtonAction(buttonId: string): void;

    customButtonVisible(buttonId: string): boolean;

    customButtonEnable(buttonId: string): boolean;
}
