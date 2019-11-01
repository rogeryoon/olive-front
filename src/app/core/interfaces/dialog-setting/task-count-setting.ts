import { IdValue } from 'app/core/models/id-value';
import { NameValue } from 'app/core/models/name-value';

export interface OliveTaskCountSetting {
    title?: string;
    count?: number;
    numerator?: number;
    denominator?: number;
    buttonColor?: string;
    buttonDescription?: string;
    subCounts?: NameValue[];
}
