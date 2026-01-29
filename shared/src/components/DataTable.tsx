/**
 * Reusable Data Table Component
 * 
 * A wrapper around AG Grid React that provides a consistent table interface
 * across all micro-frontends with built-in configuration and styling.
 */

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { 
  createDefaultColDef, 
  withPagination, 
  createRowSelection,
  withAnimations 
} from './aggrid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Register AG Grid modules once when this component loads
ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataTableProps<TData = any> {
  /** Row data for the table */
  rowData: TData[];
  /** Column definitions */
  columnDefs: ColDef<TData>[];
  /** Enable pagination (default: true) */
  pagination?: boolean;
  /** Page size (default: 20) */
  pageSize?: number;
  /** Page size options (default: [10, 20, 50, 100]) */
  pageSizeOptions?: number[];
  /** Row selection mode */
  rowSelection?: 'multiRow' | 'singleRow' | false;
  /** Enable animations (default: true) */
  animate?: boolean;
  /** Table height (default: 500px) */
  height?: number | string;
  /** Theme variant (default: 'ag-theme-quartz') */
  theme?: 'ag-theme-quartz' | 'ag-theme-quartz-dark' | 'ag-theme-material';
  /** Loading state */
  loading?: boolean;
  /** Additional AG Grid options */
  gridOptions?: GridOptions<TData>;
  /** Callback when selection changes */
  onSelectionChanged?: (selectedRows: TData[]) => void;
  /** Callback when row is clicked */
  onRowClicked?: (row: TData) => void;
}

export const DataTable = <TData extends any = any>({
  rowData,
  columnDefs,
  pagination = true,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  rowSelection = false,
  animate = true,
  height = 500,
  theme = 'ag-theme-quartz',
  loading = false,
  gridOptions = {},
  onSelectionChanged,
  onRowClicked,
}: DataTableProps<TData>) => {
  
  // Memoize default column definition
  const defaultColDef = useMemo(() => 
    createDefaultColDef(true, true, true, 1, 100, false),
    []
  );

  // Memoize grid configuration
  const finalGridOptions = useMemo<GridOptions<TData>>(() => {
    const baseConfig: GridOptions<TData> = {
      defaultColDef,
      loading,
      ...gridOptions,
    };

    // Add pagination if enabled
    if (pagination) {
      Object.assign(baseConfig, withPagination(pageSize, true, pageSizeOptions));
    }

    // Add row selection if enabled
    if (rowSelection) {
      baseConfig.rowSelection = createRowSelection(rowSelection);
    }

    // Add animations if enabled
    if (animate) {
      Object.assign(baseConfig, withAnimations());
    }

    return baseConfig;
  }, [defaultColDef, pagination, pageSize, pageSizeOptions, rowSelection, animate, loading, gridOptions]);

  // Handle selection change
  const handleSelectionChanged = (event: any) => {
    if (onSelectionChanged) {
      const selectedRows = event.api.getSelectedRows();
      onSelectionChanged(selectedRows);
    }
  };

  // Handle row click
  const handleRowClicked = (event: any) => {
    if (onRowClicked) {
      onRowClicked(event.data);
    }
  };

  return (
    <div 
      className={theme} 
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
    >
      <AgGridReact<TData>
        rowData={rowData}
        columnDefs={columnDefs}
        {...finalGridOptions}
        onSelectionChanged={handleSelectionChanged}
        onRowClicked={handleRowClicked}
      />
    </div>
  );
};

export default DataTable;
