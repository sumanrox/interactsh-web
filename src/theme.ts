import { capitalize } from '@/lib/utils';

export const themeNames = ['noir'] as const;
export type ThemeName = (typeof themeNames)[number];

export interface Theme {
  background: string;
  secondaryBackground: string;
  lightBackground: string;
  text: string;
  secondaryText: string;
  border: string;
  accent: string;
  interactive: string;
  hover: string;
  success: string;
  error: string;
  accentSubtle: string;
}

export const showThemeName = {
  show: capitalize
};

export const noirTheme: Theme = {
  background: '#0b0b0b',
  secondaryBackground: '#111111',
  lightBackground: '#1a1a1a',
  text: '#eaeaea',
  secondaryText: '#555555',
  border: '#1a1a1a',
  accent: '#b5fc58',
  interactive: '#b5fc58',
  hover: '#141414',
  success: '#b5fc58',
  error: '#ff4444',
  accentSubtle: '#1a2314', // Deep desaturated green
};

export const getTheme = (theme: ThemeName): Theme => {
  return noirTheme;
};
