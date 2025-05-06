/**
 * Generates a random integer between min and max values (inclusive).
 * @param min - The minimum value (default: 1)
 * @param max - The maximum value (default: 1000)
 * @returns A random integer between min and max (inclusive)
 *
 * @example
 * // Returns a random integer between 1 and 1000
 * generateRandomInt();
 *
 * @example
 * // Returns a random integer between 5 and 10
 * generateRandomInt(5, 10);
 */
export function generateRandomInt(min: number = 1, max: number = 1000): number {
  const minValue = Math.ceil(min)
  const maxValue = Math.floor(max)

  // The maximum and minimum are inclusive
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}
