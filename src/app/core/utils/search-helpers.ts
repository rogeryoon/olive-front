import { NameValue } from '../models/name-value';

/**
 * Creates default search option
 * @returns  
 */
export function createDefaultSearchOption() {
  return createSearchOption([{ name: 'activated', value: true }], 'name', 'asc');
}

/**
 * Creates search option
 * @param extSearches 
 * @param [orderColumnName] 
 * @param [sort] 
 * @returns search option 
 */
export function createSearchOption(extSearches: NameValue[], orderColumnName: string = null, sort: string = null): any {
  const option: any = (orderColumnName && sort) ?
    { columns: [{ data: orderColumnName }], order: [{ column: 0, dir: sort }], length: 0 } : {};

  if (extSearches && extSearches.length > 0) {
    option.extSearch = extSearches;
  }

  return option;
}

/**
 * Adds search option
 * @param dtParameters 
 * @param searchOption 
 * @returns search option 
 */
export function addSearchOption(dtParameters: any, searchOption: any): any {
  if (!dtParameters) {
    dtParameters = {};
  }

  if (!searchOption) { return dtParameters; }

  dtParameters.extSearch = searchOption.extSearch;

  if (!dtParameters.columns && searchOption.columns) {
    dtParameters.columns = searchOption.columns;
  }

  if (!dtParameters.order && searchOption.order) {
    dtParameters.order = searchOption.order;
  }

  if (!dtParameters.length && searchOption.length) {
    dtParameters.length = searchOption.length;
  }

  return dtParameters;
}

/**
 * Creates keyword search option
 * @param searchKeyword 
 * @param searchOption 
 * @param [dtParameters] 
 * @returns keyword search option 
 */
export function createKeywordSearchOption(searchKeyword: string, searchOption: any, dtParameters: any = null): void {
  dtParameters = addSearchOption(dtParameters, searchOption);

  if (searchKeyword) {
    dtParameters.search = { value: searchKeyword };
  }

  return dtParameters;
}


