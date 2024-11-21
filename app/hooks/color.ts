export const getForegroundColor = (
  backgroundColor: number,
  light: string = '#ffffff',
  dark: string = '#000000'
) => {
  const r = (backgroundColor >> 16) & 0xff;
  const g = (backgroundColor >> 8) & 0xff;
  const b = backgroundColor & 0xff;
  const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return a < 0.3 ? dark : light;
};
