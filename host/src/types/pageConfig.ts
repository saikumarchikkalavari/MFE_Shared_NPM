/**
 * Page Configuration Types
 *
 * Type definitions for /pageConfig API responses and related configuration objects
 */

/**
 * View by option for dashboard controls
 */
export interface ViewByOption {
  label: string;
  value: number;
}

/**
 * Tab configuration from pageConfig API
 */
export interface TabConfig {
  label: string;
  table: string;
  showSummaryDetailedView?: boolean;
  showTenorDropdown?: string[];
  showViewByOptions?: ViewByOption[];
}

/**
 * Page configuration response from /pageConfig API
 */
export interface PageConfig {
  showLastRefreshedDate?: boolean;
  showBatchDatePicker?: boolean;
  showPause?: boolean;
  tabs?: TabConfig[];
}

/**
 * Control option for UI controls
 */
export interface ControlOption {
  value: string;
  label: string;
}

/**
 * Visibility condition for controls
 */
export interface VisibilityCondition {
  toggle?: { equals: string };
}

/**
 * Control configuration for dashboard components
 */
export interface ControlConfig {
  toggle?: {
    options: ControlOption[];
    defaultValue: string;
  };
  dropdown?: {
    options: ControlOption[];
    defaultValue: string;
    visibleWhen?: VisibilityCondition;
  };
  radio?: {
    label: string;
    options: ControlOption[];
    defaultValue: string;
  };
}

/**
 * Processed tab configuration for Dashboard component
 */
export interface ProcessedTabConfig {
  id: string;
  label: string;
  table: string;
  showControls: boolean;
  apiEndpoint: string;
  columnDefs: any[]; // Will be populated from API response
  controls: ControlConfig;
}

/**
 * Dashboard actions configuration
 */
export interface DashboardActions {
  showBatchDate: boolean;
  showPauseButton: boolean;
}

/**
 * Complete dashboard configuration object expected by Dashboard component
 */
export interface DashboardConfig {
  pageTitle: string;
  showRefreshTime: boolean;
  pauseReleaseApiEndpoint?: string;
  actions: DashboardActions;
  tabs: ProcessedTabConfig[];
  activeTab: string;
}
