/**
 * Generates a random alphanumeric string using base-36 encoding.
 * The result includes characters from 0-9 and a-z.
 *
 * @param length Optional. If provided, limits the output string to the specified length.
 *               If not provided, returns the full random string.
 * @returns A random alphanumeric string.
 */
export const randomString = (length?: number): string => {
  const random = Math.random().toString(36).slice(2);
  return length ? random.slice(0, length) : random;
};
