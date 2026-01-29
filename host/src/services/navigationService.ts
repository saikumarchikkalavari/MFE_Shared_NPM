/**
 * Navigation Service - Updated for navigationConfig API
 *
 * Business logic for generating navigation items from navigationConfig.
 * Handles different navigation structures and manages navigation-specific functionality.
 */

import React from "react";
import type { NavigationConfig, NavigationModule, NavigationPage, NavigationItem } from "../types";

/**
 * Generates navigation items from navigationConfig
 *
 * Creates a hierarchical navigation structure from the new API format
 */
export const generateNavigationItems = (
  navigationConfig: NavigationConfig,
  navigate: (path: string) => void,
  Icons?: any
): NavigationItem[] => {
  if (!navigationConfig?.modules) return [];

  // Filter out removed modules
  const REMOVED_MODULES = ['CARTS', 'USERS', 'REPORTS', 'INTEGRATIONS'];
  const filteredModules = navigationConfig.modules.filter(
    (module: NavigationModule) => !REMOVED_MODULES.includes(module.module_code)
  );

  const sortedModules = [...filteredModules].sort(
    (a: NavigationModule, b: NavigationModule) => (a.display_order || 0) - (b.display_order || 0)
  );

  return sortedModules.map((module: NavigationModule) => {
    const modulePath = `/${module.module_code.toLowerCase().replace("_", "-")}`;
    const moduleKey = module.module_code.toLowerCase().replace("_", "-");

    return {
      id: moduleKey,
      label: module.module_name,
      path: modulePath,
      // icon: removed - host doesn't bundle icons
      // Add onClick for modules without pages to make them directly selectable
      onClick: !module.pages || module.pages.length === 0 ? () => navigate(modulePath) : undefined,
      children:
        module.pages && module.pages.length > 0
          ? module.pages
              .sort(
                (a: NavigationPage, b: NavigationPage) =>
                  (a.display_order || 0) - (b.display_order || 0)
              )
              .map((page: NavigationPage) => {
                const pageKey = page.page_code.toLowerCase();
                const pagePath = `${modulePath}/${pageKey}`;
                const childId = `${moduleKey}::${pageKey}`;

                return {
                  id: childId,
                  label: page.page_name,
                  path: pagePath,
                  // icon: removed - host doesn't bundle icons
                  onClick: () => navigate(pagePath),
                };
              })
          : [],
    };
  });
};

/**
 * Gets the default navigation path from navigationConfig
 */
export const getDefaultNavigationPath = (navigationConfig: NavigationConfig): string => {
  if (!navigationConfig?.modules) return "/";

  // Filter out removed modules
  const REMOVED_MODULES = ['CARTS', 'USERS', 'REPORTS', 'INTEGRATIONS'];
  const filteredModules = navigationConfig.modules.filter(
    (module: NavigationModule) => !REMOVED_MODULES.includes(module.module_code)
  );

  const sortedModules = [...filteredModules].sort(
    (a: NavigationModule, b: NavigationModule) => (a.display_order || 0) - (b.display_order || 0)
  );

  for (const module of sortedModules) {
    if (module.pages && module.pages.length > 0) {
      const sortedPages = [...module.pages].sort(
        (a: NavigationPage, b: NavigationPage) => (a.display_order || 0) - (b.display_order || 0)
      );
      const firstPage = sortedPages[0];
      return `/${module.module_code.toLowerCase().replace("_", "-")}/${firstPage.page_code.toLowerCase()}`;
    }
  }
  return "/";
};
