# Dashboard Component

## Overview
This is a simple dashboard component that displays data in an AG Grid table with basic refresh functionality.

## Usage

### Basic Import
```tsx
import Dashboard from './Dashboard';

// In your component
<Dashboard />
```

### Features
- **Data Grid**: Uses AG Grid to display tabular data
- **Refresh Button**: Allows users to refresh the data
- **Loading State**: Shows loading indicator while fetching data
- **Material-UI Integration**: Uses shared MUI components for consistent styling

### Customization
To modify the dashboard:

1. **Change Data Source**: Update the `queryFn` in the `useQuery` hook to fetch from your API
2. **Modify Columns**: Edit the `columnDefs` array to match your data structure
3. **Styling**: Customize the Material-UI Box components and Typography
4. **Additional Actions**: Add more buttons or controls in the header section

### Example Data Structure
The component expects data in the following format:
```typescript
[
  { id: number, name: string, value: number, status: string },
  // ... more rows
]
```

### Dependencies
- React 18+
- Material-UI (via shared/MUI)
- AG Grid (via shared/AgGrid)
- React Query (via shared/API)
- MainContent component (via shared/MainContent)
