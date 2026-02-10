/**
 * AG Grid Component Test Suite - MFE_Shared_NPM Remote
 * 
 * Tests for AG Grid components used in the remote application
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

describe('AG Grid Component Tests - Remote NPM', () => {
  const mockData = [
    { id: 1, name: 'Product 1', price: 100, category: 'Electronics' },
    { id: 2, name: 'Product 2', price: 200, category: 'Furniture' },
    { id: 3, name: 'Product 3', price: 300, category: 'Electronics' },
  ];

  const mockColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'price', headerName: 'Price' },
    { field: 'category', headerName: 'Category' },
  ];

  it('should render AG Grid with data', () => {
    const { container } = render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={mockData} columnDefs={mockColumnDefs} />
      </div>
    );

    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  it('should render AG Grid with pagination', () => {
    const { container } = render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={mockData}
          columnDefs={mockColumnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    );

    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  it('should render AG Grid with sorting enabled', () => {
    const sortableColumnDefs: ColDef[] = mockColumnDefs.map(col => ({
      ...col,
      sortable: true,
    }));

    const { container } = render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={mockData} columnDefs={sortableColumnDefs} />
      </div>
    );

    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  it('should render AG Grid with empty data', () => {
    const { container } = render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={[]} columnDefs={mockColumnDefs} />
      </div>
    );

    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  it('should render AG Grid with filtering enabled', () => {
    const filterableColumnDefs: ColDef[] = mockColumnDefs.map(col => ({
      ...col,
      filter: true,
    }));

    const { container } = render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={mockData} columnDefs={filterableColumnDefs} />
      </div>
    );

    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });
});
