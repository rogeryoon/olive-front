import { NameValue } from './name-value';

export class ParamDataTable {
    draw?: number;
    start?: number;
    lengh?: number;

    columns?: ParamColumn[];
    order?: ParamOrder[];
    search?: ParamSearch;
    extSearch?: NameValue[];
}

export class ParamSearch {
    value: string;
    regex?: boolean;
}

export class ParamColumn {
    data: string;
    name: string;
    searchable?: boolean;
    orderable?: boolean;
    search?: ParamSearch;
}

export class ParamOrder {
    column?: number;
    dir: string;
}
