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
