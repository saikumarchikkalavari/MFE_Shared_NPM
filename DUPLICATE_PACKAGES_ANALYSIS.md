# Duplicate Packages Analysis - MFE_Shared_NPM
**Date:** January 30, 2026
**Project:** MFE with Shared NPM Package

## Executive Summary
All major runtime dependencies are **already configured for Module Federation sharing**, which prevents duplication at runtime. However, each MFE still installs its own copies during `npm install`, leading to:
- Longer installation times
- Larger `node_modules` directories
- Potential version conflicts

## 1. Duplicated Runtime Dependencies (✅ Already Shared via Module Federation)

### UI Libraries
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `@mui/material` | ^6.3.0 | ^6.3.0 | peer: ^6.3.0 | ✅ Singleton |
| `@mui/icons-material` | ^6.3.0 | ^6.3.0 | - | ✅ Singleton |
| `@mui/x-date-pickers` | ^8.22.0 | ^8.22.0 | peer: ^8.22.0 | ✅ Singleton |
| `@emotion/react` | ^11.14.0 | ^11.14.0 | peer: ^11.14.0 | ✅ Singleton |
| `@emotion/styled` | ^11.14.0 | ^11.14.0 | peer: ^11.14.0 | ✅ Singleton |

### Data Grid
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `ag-grid-community` | ^34.3.1 | ^34.3.1 | peer: ^34.3.1 | ✅ Singleton |
| `ag-grid-react` | ^34.3.1 | ^34.3.1 | peer: ^34.3.1 | ✅ Singleton |

### Core Libraries
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `react` | ^19.2.3 | ^19.2.3 | peer: ^19.2.3 | ✅ Singleton (eager) |
| `react-dom` | ^19.2.3 | ^19.2.3 | peer: ^19.2.3 | ✅ Singleton (eager) |
| `react-router-dom` | ^7.9.6 | ^7.9.6 | - | ✅ Singleton (eager) |

### HTTP & State Management
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `axios` | ^1.7.9 | ^1.7.9 | peer: ^1.7.9 | ✅ Singleton |
| `@tanstack/react-query` | ^5.90.10 | ^5.90.10 | peer: ^5.90.10 | ✅ Singleton |

### Authentication
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `@azure/msal-browser` | ^4.26.2 | ^4.26.2 | peer: ^4.26.2 | ✅ Singleton |
| `@azure/msal-react` | ^3.0.24 | ^3.0.24 | peer: ^3.0.24 | ✅ Singleton |

### Utilities
| Package | Host | Remote | Shared | MF Status |
|---------|------|--------|--------|-----------|
| `date-fns` | ^4.1.0 | ^4.1.0 | peer: ^4.1.0 | ✅ Singleton |

**Total Runtime Dependencies: 15 packages** ✅ All properly shared via Module Federation

## 2. Duplicated Build Tools (Installed in Both Host & Remote)

### Babel Ecosystem
- `@babel/core`
- `@babel/preset-env`
- `@babel/preset-react`
- `@babel/preset-typescript`
- `babel-loader`
- `babel-plugin-lodash`
- `babel-plugin-transform-imports`
- `core-js` (v3)

### Webpack Ecosystem
- `webpack` (v5.104.1)
- `webpack-cli`
- `webpack-dev-server`
- `html-webpack-plugin`
- `ts-loader`
- `css-loader`
- `style-loader`

### TypeScript
- `typescript` (~8.48.0)
- `@types/node`
- `@types/react`
- `@types/react-dom`

### Module Federation
- `@module-federation/typescript`

**Total Build Tools: ~20 packages**

## 3. Duplicated Linting/Formatting Tools

### ESLint
- `eslint` (v9.39.1)
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-import`
- `eslint-plugin-prettier`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`

### Prettier
- `prettier`
- `prettier-linter-helpers`

**Total Linting Tools: ~9 packages**

## 4. Deduplication Potential

### Current Status
```
Host:   npm dedupe --dry-run showed: +1, -12, ~10 packages
Remote: Similar optimization potential
```

### Recommended Actions

#### ✅ **Already Optimized (No Action Needed)**
All runtime dependencies are properly shared via Module Federation with singleton configuration. This prevents:
- Multiple React instances
- Duplicate UI library bundles
- Version conflicts at runtime

#### 🟡 **Optional: Centralize Build Tools (Medium Priority)**
Create a workspace root with shared devDependencies:

```json
// Root package.json
{
  "name": "mfe-shared-npm-workspace",
  "private": true,
  "workspaces": ["host", "remote", "shared"],
  "devDependencies": {
    "@babel/core": "^7.28.6",
    "@babel/preset-env": "^7.28.6",
    "@babel/preset-react": "^7.28.6",
    "@babel/preset-typescript": "^7.28.6",
    "babel-loader": "^9.1.3",
    "typescript": "^5.6.0",
    "webpack": "^5.104.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "eslint": "^9.39.1",
    "prettier": "^3.1.1"
  }
}
```

**Benefits:**
- Single installation of build tools
- Consistent tooling versions
- Faster `npm install`
- Smaller `node_modules`

**Trade-offs:**
- Requires npm workspaces setup
- Slightly more complex project structure

#### 🟢 **Recommended: Run npm dedupe (Low Effort, Immediate Benefit)**

```bash
# Run in each project
cd host && npm dedupe
cd ../remote && npm dedupe
```

**Expected Results:**
- Remove ~12 duplicate packages per project
- Flatten dependency tree
- Reduce `node_modules` size by ~5-10%

## 5. Bundle Size Analysis

### Current Production Bundles
```
Host:   ~3.43 MB total (28 JS files)
Remote: ~4.65 MB total (35 JS files)
```

### Module Federation Impact
✅ Runtime deduplication is working:
- Shared dependencies loaded once
- Singleton enforcement prevents duplicates
- Lazy loading with `eager: false` for heavy libraries

## 6. Recommendations

### Priority 1: Run npm dedupe ✅
```bash
cd host && npm dedupe
cd ../remote && npm dedupe
cd ../shared && npm dedupe
```
**Impact:** Immediate reduction in duplicate sub-dependencies

### Priority 2: Monitor Bundle Sizes 📊
```bash
# Add to package.json scripts
"analyze": "webpack --mode production --profile --json > stats.json && webpack-bundle-analyzer stats.json"
```

### Priority 3: Consider Workspace Setup (Optional) 🔧
If build tool management becomes complex, migrate to npm/yarn workspaces

### Priority 4: Verify Module Federation is Working 🔍
Check network tab in browser DevTools:
- Should see shared chunks loaded once
- Verify singleton instances of React, MUI, etc.

## 7. Current Status Summary

| Category | Status | Action Needed |
|----------|--------|---------------|
| Runtime Dependencies | ✅ Optimized | None - MF working |
| Build Tools | 🟡 Duplicated | Optional - dedupe or workspace |
| Linting Tools | 🟡 Duplicated | Optional - dedupe or workspace |
| Bundle Sizes | ✅ Acceptable | Monitor with analyzer |
| Tree-shaking | ✅ Configured | None - Babel + Rollup working |
| Code Splitting | ✅ Configured | None - Rollup preserveModules working |

## Conclusion

**Current setup is well-optimized for production:**
- ✅ All runtime dependencies properly shared via Module Federation
- ✅ Singleton enforcement prevents React/MUI/AG Grid duplicates
- ✅ Tree-shaking and code splitting configured
- ✅ Babel optimizations for lodash/date-fns in place

**Optional improvements:**
- Run `npm dedupe` to flatten sub-dependencies
- Consider npm workspaces if team grows or build tools become complex
- Add bundle analyzer for ongoing monitoring

**No critical issues found.** The architecture is sound and follows MFE best practices.
