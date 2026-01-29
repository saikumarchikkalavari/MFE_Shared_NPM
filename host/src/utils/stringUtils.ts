/**
 * String Utilities
 *
 * Pure utility functions for string manipulation, formatting, and transformation.
 * These functions have no side effects and can be easily unit tested.
 */

/**
 * Converts text to URL-friendly slug format
 *
 * @param text - Input text to slugify
 * @returns URL-friendly slug (e.g., "Rates Dashboard" -> "rates-dashboard")
 */
export const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

/**
 * Converts group keys to user-friendly display names
 *
 * @param groupKey - The group identifier from user-config
 * @returns Human-readable display name
 */
export const getGroupDisplayName = (groupKey: string): string => {
  const displayNames: { [key: string]: string } = {
    "rates-portal": "Rates Portal",
    qrm: "QRM",
    citp: "CITP",
    "2052a": "2052A",
    templates: "Templates",
  };

  return (
    displayNames[groupKey.toLowerCase()] ||
    groupKey.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  );
};

/**
 * Generates unique identifier from group and route
 *
 * @param groupKey - Group identifier
 * @param routeName - Route name
 * @param separator - Separator to use (default: '::')
 * @returns Unique identifier
 */
export const generateUniqueId = (
  groupKey: string,
  routeName: string,
  separator: string = "::"
): string => {
  return `${groupKey}${separator}${slugify(routeName)}`;
};
