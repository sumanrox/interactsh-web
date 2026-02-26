export type TupleToRecord<X extends readonly string[]> = {
  [K in X[number]]: null;
};

/**
 * Creates a record from an array of strings
 * @example
 * createRecord(["dns", "http", "https"] as const)
 */
export const createRecord = <X extends readonly string[]>(arr: X): TupleToRecord<X> =>
  arr.reduce(
    (acc, key) => ({ ...acc, [key]: null }),
    {} as TupleToRecord<X>
  );

/**
 * Returns a list of "true" keys in a record
 */
export const trueKeys = <K extends string>(r: Record<K, boolean>): K[] =>
  (Object.keys(r) as K[]).filter((key) => r[key]);

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Generates a random string of specified length
 */
export const generateRandomString = (length: number, lettersOnly: boolean = false): string => {
  const characters = lettersOnly
    ? 'abcdefghijklmnopqrstuvwxyz'
    : 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Triggers a short haptic feedback (vibration) if supported by the device.
 */
export const triggerHapticFeedback = (duration: number = 10): void => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(duration);
  }
};
