/**
 * Helper function to convert a color from hex to rgb
 * Needed because the color in css property is in rgb, but the primary color is in hex format
 *
 * @param hexColor the color in hexadecimal format
 * @returns {`rgb(${number}, ${number}, ${number})`} The color as rgb definition
 */
export const hexToRGB = (hexColor) => {
  const bigint = parseInt(hexColor.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
};
