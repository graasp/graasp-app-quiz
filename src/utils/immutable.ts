import { Data } from '@graasp/apps-query-client';

const updateArrayAtIndex = <T extends object>(
  arr: T[],
  idx: number,
  newValue?: T
) => [
  ...arr.slice(0, idx),
  ...(newValue ? [newValue] : []),
  ...arr.slice(idx + 1),
];

export const removeFromArrayAtIndex = <T extends object>(
  arr: T[],
  idx: number
) => updateArrayAtIndex(arr, idx);

export const updateArray = <T extends object>(
  choices: T[],
  index: number,
  key: keyof T,
  value: T[keyof T]
): T[] => {
  const newChoice = {
    ...choices[index],
    [key]: value,
  };

  return updateArrayAtIndex(choices, index, newChoice);
};

export const setInData = <T extends Data, K extends keyof T, V extends T[K]>(
  object: Partial<T>,
  key: K,
  value: V
): Partial<T> => {
  return {
    ...object,
    [key]: value,
  };
};
