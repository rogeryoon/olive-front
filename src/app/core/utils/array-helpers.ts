
/**
 * Object Array를 Group으로 분류
 * @param list 
 * @param keyGetter 
 * @returns  
 */
export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}

/**
 * Object 배열에서 id를 key로 Map을 작성
 * @param array 
 * @returns  
 */
export function createMapFrom(array: any[]) {
  const map = new Map();
  for (const element of array) {
    map.set(element.id, element);
  }
  return map;
}
