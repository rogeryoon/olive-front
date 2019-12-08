import { NameValue } from '../models/name-value';

export function activatedNameOrderedSearchOption() {
    return searchOption();
}

export function searchOption(extSearches: NameValue[] = null, orderColumnName: string = 'name', sort: string = 'asc'): any {
    const option =
    {
        columns: [{ data: orderColumnName }],
        order: [{ column: 0, dir: sort }],
        length: 0
    };

    // Default
    if (!extSearches) {
        extSearches = [{ name: 'activated', value: true } as NameValue];
    }

    if (extSearches && extSearches.length > 0) {
        option['extSearch'] = extSearches;
    }

    return option;
}
