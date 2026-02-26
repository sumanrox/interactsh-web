import { describe, it, expect, vi } from 'vitest';
import { capitalize, generateRandomString, triggerHapticFeedback } from '../lib/utils';

describe('Utility Functions', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('test')).toBe('Test');
      expect(capitalize('TEST')).toBe('Test');
      expect(capitalize('tEST')).toBe('Test');
    });
  });

  describe('generateRandomString', () => {
    it('should generate a string of specified length', () => {
      expect(generateRandomString(10)).toHaveLength(10);
      expect(generateRandomString(20)).toHaveLength(20);
    });

    it('should contain only allowed characters', () => {
      const str = generateRandomString(100);
      expect(str).toMatch(/^[a-z0-9]+$/);
    });

    it('should contain only letters when specified', () => {
      const str = generateRandomString(100, true);
      expect(str).toMatch(/^[a-z]+$/);
    });
  });

  describe('triggerHapticFeedback', () => {
    it('should call navigator.vibrate if available', () => {
      const vibrateMock = vi.fn();
      // @ts-ignore
      global.navigator.vibrate = vibrateMock;

      triggerHapticFeedback(100);
      expect(vibrateMock).toHaveBeenCalledWith(100);
    });
  });
});
