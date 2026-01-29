# MFE WithShared - React 19.2.3

A Module Federation micro-frontend architecture using a **shared MFE pattern** based on OLD MFE, built with React 19.2.3 and compatible packages.

## Project Structure

```
MFE_WithShared/
├── host/           # Host application (port 5000)
├── remote/         # Remote dashboard components (port 5001)
├── shared/         # Shared MFE - common libraries and components (port 5002)
├── install-all.ps1 # Install dependencies for all MFEs
└── start-all.ps1   # Start all MFEs in parallel
```

## Technologies Used

- **React 19.2.3** - Latest UI framework
- **TypeScript 5.9.3** - Type safety
- **Webpack 5** - Module Federation
- **Material-UI 6.3.0** - UI components (React 19 compatible)
- **AG Grid 34.3.1** - Data grids
- **TanStack Query 5.90.10** - Data fetching
- **Azure MSAL 4.26.2** - Authentication
- **Module Federation TypeScript Plugin** - Type safety across MFEs

## Key Differences from OLD MFE

1. **React 19.2.3** instead of 18.2.0
2. **Material-UI 6.3.0** (React 19 compatible) instead of 5.14.0
3. **@mui/icons-material 6.3.0** instead of 5.x
4. **TanStack Query 5.90.10** updated from 5.0.0
5. **React Router DOM 7.9.6** latest version
6. **All shared dependencies** updated to React 19 compatible versions

## Architecture

This project follows the **shared MFE pattern** where:
- **Shared MFE (port 5002)**: Exposes common libraries, components, and utilities
- **Host MFE (port 5000)**: Main application shell, consumes shared and remote
- **Remote MFE (port 5001)**: Dashboard components, consumes shared

### Shared MFE Exports

- `shared/MUI` - Material-UI components and theme
- `shared/AgGrid` - AG Grid components
- `shared/API` - Axios, React Query, API utilities
- `shared/Auth` - MSAL authentication
- `shared/Header` - Application header
- `shared/SideNav` - Side navigation
- `shared/AppState` - Global state management

## Installation

```powershell
# Install all dependencies for all MFEs
.\install-all.ps1
```

## Running the Project

```powershell
# Start all MFEs in parallel
.\start-all.ps1
```

**Important:** Shared MFE must start first, then remote and host can start.

Or start individual MFEs:

```powershell
# Start Shared MFE first (required)
cd shared
npm start          # Runs on http://localhost:5002

# Then start Remote MFE
cd remote
npm start          # Runs on http://localhost:5001

# Finally start Host MFE
cd host
npm start          # Runs on http://localhost:5000
```

## Building for Production

```powershell
# Build all MFEs
cd shared
npm run build

cd ..\remote
npm run build

cd ..\host
npm run build
```

## Features

### Dynamic Navigation
- API-driven navigation from `/navigationConfig`
- Permission-based routing
- Icon-based menu items

### Dashboard System
- Tab-based interfaces
- Dynamic controls (toggle, dropdown, radio)
- AG Grid integration
- Batch date picker
- Pause/Release functionality

### Type Safety
- TypeScript with federated types
- Shared type definitions across MFEs
- Runtime type checking

### Theme System
- Centralized theme in shared MFE
- Consistent branding across all MFEs
- Custom color palette and typography

## Development

### Type Checking
```powershell
npm run type-check
```

### Linting
```powershell
npm run lint
npm run lint:fix
```

### Code Formatting
```powershell
npm run format
npm run format:check
```

## Module Federation Configuration

All MFEs share these singleton dependencies:
- React 19.2.3
- React-DOM 19.2.3
- Material-UI 6.3.0
- AG Grid 34.3.1
- TanStack Query 5.90.10
- MSAL 4.26.2 / 3.0.24

This ensures only one instance of each library is loaded at runtime.

## Differences from MFE_Individual

| Feature | MFE_Individual | MFE_WithShared |
|---------|---------------|----------------|
| **Pattern** | Direct npm imports | Shared MFE exports |
| **Theme** | Per-MFE theme | Centralized in shared |
| **Dependencies** | Independent per MFE | Shared singleton |
| **Components** | MUI from npm | MUI from shared MFE |
| **Complexity** | Low | Medium-High |
| **Best For** | Small teams | Enterprise with governance |

## Troubleshooting

### "Shared MFE not found" error
Make sure the shared MFE is running on port 3002 before starting host or remote.

### Type errors from federated modules
Run `npm start` in the shared MFE first to generate type definitions.

### Port conflicts
Check that ports 3000, 3001, and 3002 are available.

## License

Proprietary - Deloitte Internal Use Only
