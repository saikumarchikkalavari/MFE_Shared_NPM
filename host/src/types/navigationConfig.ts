/**
 * Navigation Configuration Types
 *
 * Type definitions for /navigationConfig API response
 */
import React from "react";

/**
 * Navigation item for UI components (processed from API data)
 */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  children?: NavigationItem[];
}
/**
 * Page configuration reference (defined by pageConfig types)
 */
export interface PageConfigRef {
  [key: string]: any; // Will be properly typed when pageConfig types are implemented
}

/**
 * Navigation page within a module
 */
export interface NavigationPage {
  id: string;
  page_code: string;
  page_name: string;
  page_path: string;
  icon: string;
  display_order: number;
  page_config: PageConfigRef;
}

/**
 * Navigation module containing pages
 */
export interface NavigationModule {
  id: string;
  module_code: string;
  module_name: string;
  description: string;
  icon: string;
  page_path: string;
  display_order: number;
  pages?: NavigationPage[];
}

/**
 * Complete navigation configuration response from /navigationConfig API
 */
export interface NavigationConfig {
  modules: NavigationModule[];
}
