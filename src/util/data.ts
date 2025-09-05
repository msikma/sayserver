// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

/**
 * Returns the item if it's an array, or returns the original item wrapped in an array if not.
 */
export function arrayWrap<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
