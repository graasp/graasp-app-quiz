import { Dictionary } from 'lodash';

export const getFirstOrUndefined = <T>(
  dataStructure: Dictionary<T[]> | undefined,
  key: string
) => {
  if (dataStructure && dataStructure[key] && dataStructure[key].length > 0) {
    return dataStructure[key][0];
  }

  return undefined;
};

export const countKeysApparition = <T, K extends keyof T>(
  elements: T[],
  key: K
) =>
  elements.reduce<Record<string, number>>((countMap, c) => {
    const loweredKey = (c[key] as string).toLowerCase();
    countMap[loweredKey] = (countMap[loweredKey] || 0) + 1;
    return countMap;
  }, {});

export const getDuplicatedKeys = <T, K extends keyof T>(
  elements: T[],
  key: K
) =>
  new Map(
    Object.entries(countKeysApparition(elements, key)).filter(
      ([_k, c]) => c > 1
    )
  );

export const hasDuplicatedKeys = (map: Map<string, number>) =>
  Array.from(map.values()).some((count) => count > 1);

/**
 * Creates a new array with the given `elementToInsert` appended just after the first occurrence of the `insertAfterElement` in the `originalArray`.
 * If the `insertAfterElement` is not found in the array, the element is appended at the end of the array.
 *
 * @param originalArray The original array to search and modify. (**not mutated**)
 * @param insertAfterElement The element to search for within the `originalArray`.
 * @param elementToInsert The element to insert after the `insertAfterElement`.
 * @typeparam T The type of elements in the array.
 * @returns A new array with the `elementToInsert` appended after the `insertAfterElement`.
 */
export const appendAfter = <T>(
  originalArray: T[],
  insertAfterElement: T,
  elementToInsert: T
) => {
  const indexOfElementAfter = originalArray.indexOf(insertAfterElement);

  if (indexOfElementAfter === -1) {
    return [...originalArray, elementToInsert];
  }

  return [
    ...originalArray.slice(0, indexOfElementAfter + 1),
    elementToInsert,
    ...originalArray.slice(indexOfElementAfter + 1),
  ];
};
