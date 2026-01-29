/**
 * DataGrid Component
 * 
 * A reusable data grid component built with AG Grid React.
 * Provides common features like sorting, filtering, pagination, and selection.
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions, GridReadyEvent, GridApi, RowSelectedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export interface DataGridProps<TData = any> {
  /** Array of row data to display */
  rowData: TData[];
  /** Column definitions */
  columnDefs: ColDef<TData>[];
  /** Enable pagination */
  pagination?: boolean;
  /** Page size for pagination */
  paginationPageSize?: number;
  /** Enable row selection */
  rowSelection?: 'singleRow' | 'multiRow';
  /** Callback when rows are selected */
  onSelectionChanged?: (selectedRows: TData[]) => void;
  /** Callback when grid is ready */
  onGridReady?: (api: GridApi) => void;
  /** Default column definition */
  defaultColDef?: ColDef;
  /** Grid height */
  height?: string | number;
  /** Enable animations */
  animateRows?: boolean;
  /** Additional grid options */
  gridOptions?: GridOptions;
  /** Test ID for testing */
  testId?: string;
}

/**
 * DataGrid Component
 */
export const DataGrid = <TData extends Record<string, any>>({
  rowData,
  columnDefs,
  pagination = false,
  paginationPageSize = 10,
  rowSelection,
  onSelectionChanged,
  onGridReady,
  defaultColDef,
  height = 400,
  animateRows = true,
  gridOptions = {},
  testId = 'data-grid',
}: DataGridProps<TData>) => {
  const gridRef = useRef<AgGridReact<TData>>(null);

  // Default column definition with common settings
  const defaultColDefMemo = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      ...defaultColDef,
    }),
    [defaultColDef]
  );

  // Handle grid ready event
  const handleGridReady = useCallback(
    (event: GridReadyEvent) => {
      if (onGridReady) {
        onGridReady(event.api);
      }
    },
    [onGridReady]
  );

  // Handle selection change
  const handleSelectionChanged = useCallback(() => {
    if (onSelectionChanged && gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      onSelectionChanged(selectedRows);
    }
  }, [onSelectionChanged]);

  // Grid options
  const gridOptionsMemo = useMemo<GridOptions>(
    () => ({
      pagination,
      paginationPageSize,
      rowSelection: rowSelection ? { mode: rowSelection as 'singleRow' | 'multiRow' } : undefined,
      animateRows,
      suppressCellFocus: false,
      enableCellTextSelection: true,
      ...gridOptions,
    }),
    [pagination, paginationPageSize, rowSelection, animateRows, gridOptions]
  );

  return (
    <div 
      data-testid={testId}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }} 
      className="ag-theme-quartz"
    >
      <AgGridReact<TData>
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDefMemo}
        onGridReady={handleGridReady}
        onSelectionChanged={handleSelectionChanged}
        {...gridOptionsMemo}
      />
    </div>
  );
};

export default DataGrid;
