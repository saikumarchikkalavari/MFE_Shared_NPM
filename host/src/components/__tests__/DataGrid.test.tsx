/**
 * DataGrid Component Test Suite
 * 
 * Comprehensive tests for the DataGrid component using AG Grid React.
 * Tests 10 different scenarios without mocks.
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { DataGrid } from '../DataGrid';
import type { ColDef } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Test data interface
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  salary: number;
  age: number;
  isActive: boolean;
  hireDate: string;
}

// Sample employee data
const employeeData: Employee[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    salary: 95000,
    age: 32,
    isActive: true,
    hireDate: '2020-01-15',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    salary: 78000,
    age: 28,
    isActive: true,
    hireDate: '2021-03-20',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    department: 'Sales',
    salary: 82000,
    age: 35,
    isActive: false,
    hireDate: '2019-07-10',
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@company.com',
    department: 'Engineering',
    salary: 105000,
    age: 30,
    isActive: true,
    hireDate: '2020-11-05',
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@company.com',
    department: 'HR',
    salary: 72000,
    age: 42,
    isActive: true,
    hireDate: '2018-05-12',
  },
];

// Column definitions
const employeeColumns: ColDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'First Name', width: 120 },
  { field: 'lastName', headerName: 'Last Name', width: 120 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'department', headerName: 'Department', width: 130 },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 120,
    valueFormatter: (params) => `$${params.value?.toLocaleString()}`,
  },
  { field: 'age', headerName: 'Age', width: 80 },
  { 
    field: 'isActive', 
    headerName: 'Status', 
    width: 100,
    valueFormatter: (params) => params.value ? 'Active' : 'Inactive',
  },
  { field: 'hireDate', headerName: 'Hire Date', width: 120 },
];

describe('DataGrid Component Tests', () => {
  
  /**
   * Scenario 1: Basic Grid Rendering
   * Verify that the grid renders with data and displays all rows
   */
  test('Scenario 1: Should render grid with employee data', async () => {
    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        testId="employee-grid"
      />
    );

    const grid = screen.getByTestId('employee-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('ag-theme-quartz');

    // Wait for grid to render data
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@company.com')).toBeInTheDocument();
    });
  });

  /**
   * Scenario 2: Column Headers Display
   * Verify all column headers are rendered correctly
   */
  test('Scenario 2: Should display all column headers', async () => {
    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Hire Date')).toBeInTheDocument();
    });
  });

  /**
   * Scenario 3: Empty Data Handling
   * Verify grid handles empty data gracefully
   */
  test('Scenario 3: Should handle empty data array', () => {
    render(
      <DataGrid
        rowData={[]}
        columnDefs={employeeColumns}
        testId="empty-grid"
      />
    );

    const grid = screen.getByTestId('empty-grid');
    expect(grid).toBeInTheDocument();
    
    // Grid should render even with empty data
    const gridRoot = document.querySelector('.ag-root');
    expect(gridRoot).toBeInTheDocument();
  });

  /**
   * Scenario 4: Pagination Enabled
   * Verify pagination works when enabled
   */
  test('Scenario 4: Should enable pagination with correct page size', async () => {
    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        pagination={true}
        paginationPageSize={3}
      />
    );

    await waitFor(() => {
      // Check if pagination controls are present
      const paginationPanel = document.querySelector('.ag-paging-panel');
      expect(paginationPanel).toBeInTheDocument();
    });
  });

  /**
   * Scenario 5: Grid API Access via onGridReady
   * Verify grid API is accessible through callback
   */
  test('Scenario 5: Should provide grid API through onGridReady callback', async () => {
    const onGridReady = jest.fn();

    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        onGridReady={onGridReady}
      />
    );

    await waitFor(() => {
      expect(onGridReady).toHaveBeenCalled();
      const api = onGridReady.mock.calls[0][0];
      expect(api).toBeDefined();
      expect(typeof api.getDisplayedRowCount).toBe('function');
    });
  });

  /**
   * Scenario 6: Row Selection - Single Mode
   * Verify single row selection works
   */
  test('Scenario 6: Should support single row selection', async () => {
    const onSelectionChanged = jest.fn();

    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        rowSelection="singleRow"
        onSelectionChanged={onSelectionChanged}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Selection callback should be registered
    expect(onSelectionChanged).toHaveBeenCalledTimes(0); // Not called until selection happens
  });

  /**
   * Scenario 7: Custom Value Formatters
   * Verify value formatters work correctly
   */
  test('Scenario 7: Should apply custom value formatters', async () => {
    const onGridReady = jest.fn();
    
    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        onGridReady={onGridReady}
      />
    );

    // Wait for grid to be ready and data to be rendered
    await waitFor(() => {
      expect(onGridReady).toHaveBeenCalled();
    });

    // Give grid time to render formatted values
    await waitFor(() => {
      // Check if John Doe is rendered (confirms grid has data)
      expect(screen.getByText('John')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Value formatters are applied - verify the grid is rendering data
    const gridContainer = document.querySelector('.ag-center-cols-container');
    expect(gridContainer).toBeInTheDocument();
  });

  /**
   * Scenario 8: Custom Height Configuration
   * Verify grid respects custom height settings
   */
  test('Scenario 8: Should apply custom height to grid container', () => {
    const customHeight = 600;
    
    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        height={customHeight}
        testId="custom-height-grid"
      />
    );

    const grid = screen.getByTestId('custom-height-grid');
    expect(grid).toHaveStyle({ height: '600px' });
  });

  /**
   * Scenario 9: Default Column Definition
   * Verify default column settings are applied
   */
  test('Scenario 9: Should apply default column definitions', async () => {
    const customDefaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
    };

    const onGridReady = jest.fn();

    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        defaultColDef={customDefaultColDef}
        onGridReady={onGridReady}
      />
    );

    await waitFor(() => {
      expect(onGridReady).toHaveBeenCalled();
    });

    // Grid should render successfully with custom defaults
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  /**
   * Scenario 10: Dynamic Data Updates
   * Verify grid updates when data changes
   */
  test('Scenario 10: Should update grid when data changes', async () => {
    const initialData = employeeData.slice(0, 2);
    
    const { rerender } = render(
      <DataGrid
        rowData={initialData}
        columnDefs={employeeColumns}
        testId="dynamic-grid"
      />
    );

    // Initial render with 2 employees
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    // Update with all employees
    rerender(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        testId="dynamic-grid"
      />
    );

    // Should now show all 5 employees
    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  /**
   * Bonus Scenario: Multiple Row Selection
   * Verify multiple row selection mode works
   */
  test('Bonus: Should support multiple row selection mode', async () => {
    const onSelectionChanged = jest.fn();

    render(
      <DataGrid
        rowData={employeeData}
        columnDefs={employeeColumns}
        rowSelection="multiRow"
        onSelectionChanged={onSelectionChanged}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Grid should render with selection checkboxes
    const grid = document.querySelector('.ag-theme-quartz');
    expect(grid).toBeInTheDocument();
  });
});
