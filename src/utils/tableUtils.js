/**
 * Object that represent an enum with the possible value for ordering property
 *
 * @type {Readonly<{ASC: string, DESC: string}>}
 */
export const Order = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

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
const comparator = (e1, e2) => {
  if (e2 < e1) {
    return -1;
  }
  if (e2 > e1) {
    return 1;
  }
  return 0;
};

/**
 * Helper function to get the correct comparator depending on whether we are sorting ascending or descending
 *
 * @param {string} order The order for which we want to get the comparator
 * @returns {{(string, string): number}} The comparator corresponding to the required order
 */
export const getComparator = (order) =>
  order === Order.DESC
    ? (a, b) => comparator(a, b)
    : (a, b) => -comparator(a, b);
