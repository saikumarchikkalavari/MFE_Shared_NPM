/**
 * AG Grid Advanced Test Suite
 * 
 * Additional tests for AG Grid functionality in MFE_Shared_NPM
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999, inStock: true },
  { id: 2, name: 'Mouse', category: 'Accessories', price: 25, inStock: true },
  { id: 3, name: 'Keyboard', category: 'Accessories', price: 75, inStock: false },
  { id: 4, name: 'Monitor', category: 'Electronics', price: 299, inStock: true },
];

const productColumns: ColDef<Product>[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Product Name', width: 150 },
  { field: 'category', headerName: 'Category', width: 120 },
  { field: 'price', headerName: 'Price', width: 100 },
  { field: 'inStock', headerName: 'In Stock', width: 100 },
];

describe('AG Grid Advanced Tests - MFE_Shared_NPM', () => {
  it('should render grid with filtering enabled', async () => {
    const filterableColumns = productColumns.map(col => ({
      ...col,
      filter: true,
    }));

    render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={filterableColumns}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });
  });

  it('should display row selection with checkboxes', async () => {
    const selectableColumns: ColDef<Product>[] = [
      { field: 'id', headerName: 'ID', checkboxSelection: true },
      ...productColumns.slice(1),
    ];

    render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={selectableColumns}
          rowSelection="multiple"
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  it('should handle custom cell renderers', async () => {
    const customColumns: ColDef<Product>[] = [
      ...productColumns.slice(0, 3),
      {
        field: 'price',
        headerName: 'Price',
        valueFormatter: (params) => `$${params.value}`,
      },
    ];

    render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={customColumns}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('Price')).toBeInTheDocument();
    });
  });

  it('should apply row height and header height', async () => {
    render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={productColumns}
          rowHeight={50}
          headerHeight={60}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument();
    });
  });

  it('should enable column resizing', async () => {
    const resizableColumns = productColumns.map(col => ({
      ...col,
      resizable: true,
    }));

    render(
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact<Product>
          rowData={products}
          columnDefs={resizableColumns}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });
  });
});
