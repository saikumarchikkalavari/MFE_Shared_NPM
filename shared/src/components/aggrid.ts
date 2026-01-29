/**
 * AG Grid Wrappers and Utilities
 * 
 * This module exports ONLY custom utilities and configuration helpers.
 * Consumers should install ag-grid-react and ag-grid-community themselves.
 * 
 * NOTE: ModuleRegistry should be initialized in the host application's bootstrap.
 */

// Base column definition builder with separate parameters
export const createDefaultColDef = (
  sortable = true,
  filter = true,
  resizable = true,
  flex = 1,
  minWidth = 100,
  floatingFilter = false,
  overrides = {}
) => ({
  sortable,
  filter,
  resizable,
  flex,
  minWidth,
  floatingFilter,
  ...overrides,
});

// Feature functions - compose as needed
export const withPagination = (
  pageSize = 20,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100],
  options = {}
) => ({
  pagination: true,
  paginationPageSize: pageSize,
  paginationPageSizeSelector: showPageSizeSelector,
  paginationPageSizes: pageSizeOptions,
  ...options,
});

export const withRowSelection = (mode = "multiRow", options = {}) => ({
  rowSelection: {
    mode,
    enableClickSelection: true,
    headerCheckbox: true,
    checkboxes: true,
    ...options,
  },
});

export const withAnimations = (options = {}) => ({
  animateRows: true,
  ...options,
});

// Row selection configuration helpers
export const createRowSelection = (mode: "multiRow" | "singleRow" = "multiRow", options = {}) => ({
  mode,
  enableClickSelection: true,
  headerCheckbox: mode === "multiRow",
  checkboxes: true,
  ...options,
} as const);

// Grid configuration presets
export const createGridConfig = (options = {}) => ({
  ...createDefaultColDef(),
  ...withPagination(),
  ...withAnimations(),
  rowSelection: createRowSelection(),
  ...options,
});

// // Style helpers
// export const getTableHeight = (size = 'medium') => {
//   const heights = { compact: 300, medium: 500, large: 700 };
//   return typeof size === 'number' ? size : heights[size];
// };

// export const getTableTheme = (theme = 'default') => {
//   const themes = {
//     default: 'ag-theme-quartz',
//     dark: 'ag-theme-quartz-dark',
//     material: 'ag-theme-material'
//   };
//   return themes[theme];
// };
