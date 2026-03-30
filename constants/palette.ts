export const palette = {
  darkBlue: '#00408C',
  blue: '#96ADD6',
  red: '#E85234',
  peach: '#F9B8AF',
  cream: '#F2EEE9',
  pink: '#F2D7D3',
  white: '#FFFFFF',
  ink: '#111111',
} as const;

export type PaletteColor = keyof typeof palette;
