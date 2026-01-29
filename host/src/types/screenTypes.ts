/**
 * Screen Type Definitions
 *
 * Defines the different types of screens available in the application
 * and their associated configuration interfaces.
 */

export enum ScreenType {
  DASHBOARD = "DASHBOARD",
  RECALCULATION = "RECALCULATION",
  VIEW_DATA = "VIEW_DATA",
  UPLOADS = "UPLOADS",
  AUDIT_TABLE = "AUDIT_TABLE",
  TEMPLATES = "TEMPLATES",
  PLACEHOLDER = "PLACEHOLDER",
}

export interface PlaceholderScreenProps {
  screenType: ScreenType;
  routeName: string;
  groupKey: string;
}

// Screen type registry mapping route names to screen types
export interface ScreenTypeRegistry {
  [routeName: string]: ScreenType;
}
