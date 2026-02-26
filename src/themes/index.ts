export interface Theme {
  name: string;
  background: string;
  secondaryBackground: string;
  lightBackground: string;
  text: string;
  secondaryText: string;
  border: string;
  accent: string;
  accentRGB: string; // Used for translucent effects
  interactive: string;
  hover: string;
  success: string;
  error: string;
  accentSubtle: string;
}

export const cyanTheme: Theme = {
  name: 'cyan',
  background: '#0a0a0c',
  secondaryBackground: '#12141a',
  lightBackground: '#1e212b',
  text: '#ffffff',
  secondaryText: '#888ea1',
  border: '#232631',
  accent: '#00e5ff',
  accentRGB: '0, 229, 255',
  interactive: '#00e5ff',
  hover: '#1a1d26',
  success: '#00ff9d',
  error: '#ff0055',
  accentSubtle: '#002a30',
};

export const limeTheme: Theme = {
  name: 'lime',
  background: '#0b0b0b',
  secondaryBackground: '#111111',
  lightBackground: '#1a1a1a',
  text: '#eaeaea',
  secondaryText: '#888888',
  border: '#222222',
  accent: '#b5fc58',
  accentRGB: '181, 252, 88',
  interactive: '#b5fc58',
  hover: '#141414',
  success: '#b5fc58',
  error: '#ff4444',
  accentSubtle: '#1a2314',
};

export const sunsetTheme: Theme = {
  name: 'sunset',
  background: '#0f0a0a',
  secondaryBackground: '#1a1212',
  lightBackground: '#261a1a',
  text: '#ffffff',
  secondaryText: '#a18888',
  border: '#312323',
  accent: '#ff8c00',
  accentRGB: '255, 140, 0',
  interactive: '#ff8c00',
  hover: '#261d1d',
  success: '#ffcf00',
  error: '#ff3c00',
  accentSubtle: '#301a00',
};

export const themes: Record<string, Theme> = {
  cyan: cyanTheme,
  lime: limeTheme,
  sunset: sunsetTheme,
};

export type ThemeName = keyof typeof themes;

export const defaultTheme = cyanTheme;
