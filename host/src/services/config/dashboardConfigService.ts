/**
 * Dashboard Configuration Service
 *
 * Transforms pageConfig API responses into Dashboard component configurations.
 *
 * Key responsibilities:
 * - Transform pageConfig into dashboard component format
 * - Generate tabs and controls from pageConfig
 * - Handle conditional business logic for dashboard features
 */

import type {
  PageConfig,
  TabConfig,
  DashboardConfig,
  ProcessedTabConfig,
  ControlConfig,
  ViewByOption,
} from "../../types";

/**
 * Generates dashboard configuration from pageConfig API response
 *
 * Transforms pageConfig into the structure expected by the Dashboard component.
 * Handles tabs, controls, and action buttons based on the pageConfig.
 *
 * @param pageTitle - The page title (e.g., 'Rates Dashboard')
 * @param pageConfig - Page configuration response from API
 * @returns Dashboard component configuration object
 */
export const generateDashboardConfigFromPageConfig = (
  pageTitle: string,
  pageConfig: PageConfig | null
): DashboardConfig => {
  if (!pageConfig) {
    return {
      pageTitle,
      showRefreshTime: true,
      tabs: [],
      activeTab: "",
      actions: {
        showBatchDate: false,
        showPauseButton: false,
      },
    };
  }

  // Generate tabs from pageConfig
  const tabs = generateTabsFromPageConfig(pageConfig.tabs || []);

  return {
    pageTitle,
    // Show refresh timestamp based on configuration
    showRefreshTime: pageConfig.showLastRefreshedDate ?? true,
    // API endpoint for pause/release functionality
    pauseReleaseApiEndpoint: `/api/dashboard/pause-release`,
    actions: {
      showBatchDate: pageConfig.showBatchDatePicker ?? false,
      showPauseButton: pageConfig.showPause ?? false,
    },
    tabs: tabs,
    activeTab: tabs.length > 0 ? tabs[0].id : "",
  };
};

/**
 * Generates tab configurations from pageConfig tabs
 */
const generateTabsFromPageConfig = (tabsConfig: TabConfig[] = []): ProcessedTabConfig[] => {
  if (!tabsConfig || tabsConfig.length === 0) {
    return [];
  }

  return tabsConfig.map((tab, index) => {
    const tabId = tab.label.toLowerCase().replace(/\s+/g, "-");

    return {
      id: tabId,
      label: tab.label,
      table: tab.table,
      showControls: tab.showSummaryDetailedView ?? false,
      apiEndpoint: `/api/dashboard?table=${tab.table}`,
      columnDefs: [], // Will be populated from API response
      controls: generateControlsFromPageConfigTab(tab),
    };
  });
};

/**
 * Generates control configurations from pageConfig tab configuration
 */
const generateControlsFromPageConfigTab = (tab: TabConfig): ControlConfig => {
  const controls: ControlConfig = {};

  // Add toggle control for Summary/Detailed view if enabled
  if (tab.showSummaryDetailedView) {
    controls.toggle = {
      options: [
        { value: "summary", label: "Summary" },
        { value: "detailed", label: "Detailed" },
      ],
      defaultValue: "summary",
    };
  }

  // Add dropdown for tenor selection if available
  if (tab.showTenorDropdown && tab.showTenorDropdown.length > 0) {
    controls.dropdown = {
      options: tab.showTenorDropdown.map((tenor: string) => ({
        value: tenor,
        label: tenor,
      })),
      defaultValue: tab.showTenorDropdown[0],
      visibleWhen: tab.showSummaryDetailedView ? { toggle: { equals: "detailed" } } : undefined,
    };
  }

  // Add radio control for view by options if available
  if (tab.showViewByOptions && tab.showViewByOptions.length > 0) {
    controls.radio = {
      label: "View By",
      options: tab.showViewByOptions.map((option: ViewByOption) => ({
        value: option.value.toString(),
        label: option.label,
      })),
      defaultValue: tab.showViewByOptions[0].value.toString(),
    };
  }

  return controls;
};
