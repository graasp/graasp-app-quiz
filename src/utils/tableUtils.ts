/**
 * Object that represent an enum with the possible value for ordering property
 *
 * @type {Readonly<{ASC: string, DESC: string}>}
 */
export const Order = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

/**
 * Helper function to compare two elements
 *
 * Return 0 if they are equal
 * Return 1 if the first element is smaller
 * Return -1 if the second element is smaller
 *
 * @param {string} e1 The first username
 * @param {string} e2 The second username
 * @returns {number} Whether the first one or the second one is the biggest
 */
export const stringComparator = (e1: string, e2: string) => {
  if (e2 < e1) {
    return -1;
  }
  if (e2 > e1) {
    return 1;
  }
  return 0;
};

/**
 * Helper function to compare two element, the element to compare are object that contains an
 * element with element key `name`
 *
 * @param e1 The first object
 * @param e2 The second object
 * @return {number} Whether the first one or the second one is the biggest
 */
export const comparatorArrayByElemName = (
  e1: { name: string },
  e2: { name: string }
) => {
  if (e2.name < e1.name) {
    return -1;
  }
  if (e2.name > e1.name) {
    return 1;
  }
  return 0;
};

/**
 * Helper function to get the correct comparator depending on whether we are sorting ascending or descending
 *
 * @param {string} order The order for which we want to get the comparator
 * @param comp The comparator to use to compare
 * @returns {{(string, string): number}} The comparator corresponding to the required order
 */
export const getComparator = <T>({
  order,
  comp,
}: {
  order?: string;
  comp: (a: T, b: T) => number;
}) =>
  order === Order.DESC
    ? (a: T, b: T) => comp(a, b)
    : (a: T, b: T) => -comp(a, b);

/**
 * Helper function to substitute spaces by hyphens in strings to be able to use them as inner links
 *
 * @param {String} linkName The string that we want to format as an inner link
 */
export const formatInnerLink = (linkName: string) =>
  linkName.replaceAll(' ', '-');
