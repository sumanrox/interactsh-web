import { describe, it, expect } from 'vitest';
import { themes, cyanTheme, limeTheme, sunsetTheme } from '../themes';

describe('Themes', () => {
  it('should have all expected themes', () => {
    expect(themes).toHaveProperty('cyan');
    expect(themes).toHaveProperty('lime');
    expect(themes).toHaveProperty('sunset');
  });

  it('cyan theme should have correct properties', () => {
    expect(cyanTheme.accent).toBe('#00e5ff');
    expect(cyanTheme.background).toBe('#0a0a0c');
  });

  it('lime theme should have correct properties', () => {
    expect(limeTheme.accent).toBe('#b5fc58');
    expect(limeTheme.background).toBe('#0b0b0b');
  });

  it('sunset theme should have correct properties', () => {
    expect(sunsetTheme.accent).toBe('#ff8c00');
    expect(sunsetTheme.background).toBe('#0f0a0a');
  });
});
