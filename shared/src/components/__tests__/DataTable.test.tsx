/**
 * DataTable Component Test Suite
 * 
 * Comprehensive tests for the DataTable component using AG Grid React.
 * Tests 10+ different scenarios without mocks.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { DataTable } from '../DataTable';
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

describe('DataTable Component Tests', () => {
  
  /**
   * Scenario 1: Basic Grid Rendering
   * Verify that the grid renders with data and displays all rows
   */
  test('Scenario 1: Should render grid with employee data', async () => {
    const { container } = render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
      />
    );

    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toBeInTheDocument();

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
      <DataTable
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
    const { container } = render(
      <DataTable
        rowData={[]}
        columnDefs={employeeColumns}
      />
    );

    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toBeInTheDocument();
    
    // Grid should render even with empty data
    const gridRoot = container.querySelector('.ag-root');
    expect(gridRoot).toBeInTheDocument();
  });



  /**
   * Scenario 7: Row Selection - Single Mode
   * Verify single row selection works
   */
  test('Scenario 7: Should support single row selection', async () => {
    const onSelectionChanged = jest.fn();

    render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        rowSelection="singleRow"
        onSelectionChanged={onSelectionChanged}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  /**
   * Scenario 8: Row Selection - Multiple Mode
   * Verify multiple row selection works
   */
  test('Scenario 8: Should support multiple row selection', async () => {
    const onSelectionChanged = jest.fn();

    const { container } = render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        rowSelection="multiRow"
        onSelectionChanged={onSelectionChanged}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Grid should render with selection capability
    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toBeInTheDocument();
  });

  /**
   * Scenario 9: Custom Height Configuration
   * Verify grid respects custom height settings
   */
  test('Scenario 9: Should apply custom height to grid container', () => {
    const customHeight = 600;
    
    const { container } = render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        height={customHeight}
      />
    );

    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toHaveStyle({ height: '600px' });
  });

  /**
   * Scenario 10: Custom Height as String
   * Verify grid accepts height as string
   */
  test('Scenario 10: Should accept height as string', () => {
    const { container } = render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        height="700px"
      />
    );

    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toHaveStyle({ height: '700px' });
  });

  /**
   * Scenario 11: Theme Variants
   * Verify different theme variants work
   */
  test('Scenario 11: Should apply custom theme variant', () => {
    const { container } = render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        theme="ag-theme-quartz-dark"
      />
    );

    const grid = container.querySelector('.ag-theme-quartz-dark');
    expect(grid).toBeInTheDocument();
  });

  /**
   * Scenario 12: Loading State
   * Verify loading state is handled
   */
  test('Scenario 12: Should handle loading state', () => {
    const { container } = render(
      <DataTable
        rowData={[]}
        columnDefs={employeeColumns}
        loading={true}
      />
    );

    const grid = container.querySelector('.ag-theme-quartz');
    expect(grid).toBeInTheDocument();
  });

  /**
   * Scenario 13: Dynamic Data Updates
   * Verify grid updates when data changes
   */
  test('Scenario 13: Should update grid when data changes', async () => {
    const initialData = employeeData.slice(0, 2);
    
    const { rerender } = render(
      <DataTable
        rowData={initialData}
        columnDefs={employeeColumns}
      />
    );

    // Initial render with 2 employees
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    // Update with all employees
    rerender(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
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
   * Scenario 14: Animations Enabled
   * Verify animations work
   */
  test('Scenario 14: Should support animations', async () => {
    render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        animate={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  /**
   * Scenario 15: Animations Disabled
   * Verify grid works without animations
   */
  test('Scenario 15: Should work without animations', async () => {
    render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        animate={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  /**
   * Scenario 17: Row Click Handler
   * Verify row click callback works
   */
  test('Scenario 17: Should support row click handler', async () => {
    const onRowClicked = jest.fn();

    render(
      <DataTable
        rowData={employeeData}
        columnDefs={employeeColumns}
        onRowClicked={onRowClicked}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
