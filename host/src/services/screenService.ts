/**
 * Screen Service
 *
 * Business logic for screen type detection and screen-related functionality.
 * Handles the mapping of route names to appropriate screen types.
 */

import { ScreenType, ScreenTypeRegistry } from "../types";

/**
 * Registry mapping exact route names to screen types
 * This is the single source of truth for route-to-screen mapping
 */
export const SCREEN_REGISTRY: ScreenTypeRegistry = {
  // Dashboard-type screens (use DashboardWrapper)
  "Rates Dashboard": ScreenType.DASHBOARD,
  "Term Sofr": ScreenType.DASHBOARD,
  "Active Transaction": ScreenType.DASHBOARD,
  "Failed Transaction": ScreenType.DASHBOARD,
  Logs: ScreenType.DASHBOARD,
  // Template screens
  Templates: ScreenType.TEMPLATES,
  // Recalculation screens
  Recalculate: ScreenType.RECALCULATION,
  // Legacy screens
  "View Data": ScreenType.VIEW_DATA,
  Uploads: ScreenType.UPLOADS,
  "Audit Table": ScreenType.AUDIT_TABLE,
};

/**
 * Gets screen type display information
 *
 * @param screenType - Screen type
 * @returns Display information for the screen type
 */
export const getScreenTypeInfo = (
  screenType: ScreenType
): { name: string; description: string; icon: string } => {
  const screenInfo = {
    [ScreenType.DASHBOARD]: {
      name: "Dashboard",
      description: "Interactive dashboard with data visualization and controls",
      icon: "Dashboard",
    },
    [ScreenType.RECALCULATION]: {
      name: "Recalculation",
      description: "Recalculation and processing functionality",
      icon: "Calculate",
    },
    [ScreenType.VIEW_DATA]: {
      name: "View Data",
      description: "Data viewing and browsing interface",
      icon: "ViewList",
    },
    [ScreenType.UPLOADS]: {
      name: "Uploads",
      description: "File upload and management interface",
      icon: "CloudUpload",
    },
    [ScreenType.AUDIT_TABLE]: {
      name: "Audit Table",
      description: "Audit log and history tracking",
      icon: "History",
    },
    [ScreenType.TEMPLATES]: {
      name: "Templates",
      description: "Template management and configuration",
      icon: "Description",
    },
    [ScreenType.PLACEHOLDER]: {
      name: "Coming Soon",
      description: "This feature is under development",
      icon: "Construction",
    },
  };

  return screenInfo[screenType];
};
