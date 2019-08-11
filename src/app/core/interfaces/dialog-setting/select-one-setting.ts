import { IdName } from 'app/core/models/id-name';

export interface OliveSelectOneSetting {
    title?: string;
    description?: string;
    items: IdName[];
    oneClick?: boolean;
}
