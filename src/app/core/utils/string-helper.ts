
/**
 * 입력 문자열이 필요 소숫점 자릿수를 가지고 있는지 확인
 * @param input 문자열
 * @param maxPrecision 최대 소숫점 자릿수
 * @returns true if number 
 */
export function isNumber(input: string, maxPrecision: number): boolean {
    let decimalPattern = '';

    if (maxPrecision > 0) {
        decimalPattern = `(\\.\\d{1,${maxPrecision}})?`;
    }

    const pattern = new RegExp(`^\\s*\\d*${decimalPattern}\\s*$`);

    return pattern.test(input);
}


/**
 * Determines whether money pattern is
 * @param input 
 * @returns true if money
 */
export function isMoneyPattern(input: string): boolean {
    return /^\s*\d*(\.\d{1,2})?\s*$/.test(input);
}

/**
 * Make the string to camel case
 * @param input 
 * @returns camelized string
 */
export function camelize(str): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) { return ''; } // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

/**
 * Determines whether number pattern is
 * @param input 
 * @returns  
 */
export function isNumberPattern(input: string) {
    return /^\s*\d*\s*$/.test(input);
}

/**
 * Webs site host name
 * @param url 
 * @returns site host name 
 */
export function webSiteHostName(url: string): string {
    url = webSiteUrl(url);

    if (url == null) { return null; }

    return getLocation(url).hostname.replace(/www./gi, '');
}

/**
 * Gets location
 * @param url 
 * @returns location 
 */
export function getLocation(url: string): any {
    const l = document.createElement('a');
    l.href = url;
    return l;
}

/**
 * Adjusts url
 * @param url 
 * @returns url 
 */
export function adjustUrl(url: string): string {
    // remove prefix
    url = url.replace(/https?:\/\//gi, '');
    // append standard url type
    return 'http://' + url;
}

/**
 * Webs site url
 * @param url 
 * @returns site url 
 */
export function webSiteUrl(url: string): string {
    if (!url) { return null; }

    url = adjustUrl(url);
    const valid = isValidWebSiteUrl(url);

    if (!valid) { return null; }

    return url;
}

/**
 * Determines whether valid web site url is
 * @param url 
 * @returns true if valid web site url 
 */
export function isValidWebSiteUrl(url: string): boolean {
    return /^https?:\/\/[^ "]+$/i.test(url);
}
