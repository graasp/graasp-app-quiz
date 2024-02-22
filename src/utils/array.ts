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
