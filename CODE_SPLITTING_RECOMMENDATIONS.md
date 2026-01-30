# Code-Splitting & Lazy-Loading Recommendations

## Executive Summary

Based on analysis of your MFE_Shared_NPM architecture, here are prioritized recommendations to reduce initial bundle size from **~4 MB (host)** and **~4.8 MB (remote)** through strategic code-splitting and lazy-loading.

**Expected Impact:**
- Initial bundle reduction: **40-60%** (from ~4 MB to ~1.5-2 MB)
- First Contentful Paint: **30-50% faster**
- Time to Interactive: **40-60% faster**

---

## 🎯 Priority 1: Route-Based Code Splitting (HIGH IMPACT)

### Current Problem
All wrapper components (DashboardWrapper, TemplateWrapper, RecalculationWrapper) are eagerly loaded in `ScreenComponentFactory.tsx`, even for routes the user never visits.

### Recommendation: Lazy Load Route Components

**File:** `host/src/components/ScreenComponentFactory.tsx`

```typescript
import React, { Suspense, lazy } from "react";
import { CircularProgress, Box } from "@mui/material";
import { SCREEN_REGISTRY } from "../services";
import { ScreenType } from "../types";
import PlaceholderScreen from "./PlaceholderScreen"; // Keep eager (small)

// ✅ LAZY LOAD: Heavy components with remote dependencies
const DashboardWrapper = lazy(() => import("./DashboardWrapper"));
const TemplateWrapper = lazy(() => import("./TemplateWrapper"));
const RecalculationWrapper = lazy(() => import("./RecalculationWrapper"));

// ✅ IMPROVED: Better loading fallback
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '400px' 
  }}>
    <CircularProgress size={40} />
  </Box>
);

export const createScreenComponent = (pageName: string, moduleCode: string): React.ReactElement => {
  const screenType = SCREEN_REGISTRY[pageName] || ScreenType.PLACEHOLDER;

  switch (screenType) {
    case ScreenType.DASHBOARD:
      return (
        <Suspense fallback={<LoadingFallback />}>
          <DashboardWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    case ScreenType.TEMPLATES:
      return (
        <Suspense fallback={<LoadingFallback />}>
          <TemplateWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    case ScreenType.RECALCULATION:
      return (
        <Suspense fallback={<LoadingFallback />}>
          <RecalculationWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    default:
      return (
        <PlaceholderScreen screenType={screenType} routeName={pageName} groupKey={moduleCode} />
      );
  }
};
```

**Expected Savings:** ~800 KB - 1.2 MB per lazy-loaded wrapper

---

## 🎯 Priority 2: Lazy Load Remote Components (HIGH IMPACT)

### Current Problem
Remote Dashboard component (1.09 MB chunk) is imported in `DashboardWrapper.tsx` but may not be needed on initial page load.

### Recommendation: Defer Remote Import Until Route Match

**File:** `host/src/components/DashboardWrapper.tsx`

```typescript
import React, { useMemo, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import { apiEndpoints } from "../config/api";
import { generateDashboardConfigFromPageConfig } from "../services/config";
import type { PageConfig } from "../types";

// ✅ IMPROVED: Lazy load remote with proper typing
const Dashboard = lazy(() => 
  import("remote/Dashboard").then(module => ({
    default: module.default
  }))
);

// ✅ NEW: Better loading fallback with context
const DashboardLoadingFallback = ({ pageName }: { pageName: string }) => (
  <Box sx={{ p: 3, textAlign: "center" }}>
    <CircularProgress />
    <Typography variant="body2" sx={{ mt: 2 }}>
      Loading {pageName}...
    </Typography>
  </Box>
);

interface DashboardWrapperProps {
  pageName: string;
  moduleCode: string;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ pageName, moduleCode }) => {
  const {
    data: pageConfig,
    isLoading,
    error,
  } = useQuery<PageConfig>({
    queryKey: ["pageConfig", moduleCode, pageName],
    queryFn: () => apiEndpoints.getPageConfig(moduleCode, pageName),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const dashboardConfig = useMemo(() => {
    if (!pageConfig) {
      return {
        pageTitle: pageName,
        showRefreshTime: true,
        tabs: [],
        activeTab: "",
        actions: { showBatchDate: false, showPauseButton: false },
      };
    }
    return generateDashboardConfigFromPageConfig(pageName, pageConfig);
  }, [pageName, pageConfig]);

  if (isLoading) {
    return <DashboardLoadingFallback pageName={pageName} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading {pageName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    );
  }

  // ✅ IMPROVED: Suspense boundary ONLY around remote component
  return (
    <Suspense fallback={<DashboardLoadingFallback pageName={pageName} />}>
      <Dashboard config={dashboardConfig} />
    </Suspense>
  );
};

export default DashboardWrapper;
```

**Expected Savings:** ~1.09 MB deferred until Dashboard route accessed

---

## 🎯 Priority 3: Split Large Vendor Chunks (MEDIUM IMPACT)

### Current Problem
Single `600.js` vendor chunk contains 1.09 MB of AG Grid + other libraries. This blocks initial render even if user never uses grid features.

### Recommendation: Configure Webpack SplitChunks

**File:** `host/webpack.config.js` & `remote/webpack.config.js`

Add to existing `optimization` block:

```javascript
optimization: {
  usedExports: true,
  sideEffects: false,
  moduleIds: 'deterministic',
  
  // ✅ NEW: Advanced code splitting configuration
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 25,
    maxAsyncRequests: 25,
    cacheGroups: {
      // React ecosystem (highest priority - always needed)
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
        name: 'vendor-react',
        priority: 40,
        reuseExistingChunk: true,
      },
      
      // MSAL authentication (medium priority - needed after login)
      msal: {
        test: /[\\/]node_modules[\\/](@azure[\\/]msal-)[\\/]/,
        name: 'vendor-msal',
        priority: 35,
        reuseExistingChunk: true,
      },
      
      // MUI components (medium priority - used throughout)
      mui: {
        test: /[\\/]node_modules[\\/](@mui[\\/]|@emotion[\\/])[\\/]/,
        name: 'vendor-mui',
        priority: 30,
        reuseExistingChunk: true,
      },
      
      // AG Grid (LOW priority - only needed for dashboard/grids)
      aggrid: {
        test: /[\\/]node_modules[\\/](ag-grid-)[\\/]/,
        name: 'vendor-aggrid',
        priority: 25,
        reuseExistingChunk: true,
        enforce: true, // Always split even if small
      },
      
      // React Query (medium priority)
      reactQuery: {
        test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
        name: 'vendor-react-query',
        priority: 28,
        reuseExistingChunk: true,
      },
      
      // Date utilities (low priority)
      dates: {
        test: /[\\/]node_modules[\\/](date-fns|@mui[\\/]x-date-pickers)[\\/]/,
        name: 'vendor-dates',
        priority: 20,
        reuseExistingChunk: true,
      },
      
      // Other vendors
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor-commons',
        priority: 10,
        reuseExistingChunk: true,
      },
      
      // Shared code from @mfe/shared-lib
      sharedLib: {
        test: /[\\/]node_modules[\\/]@mfe[\\/]shared-lib[\\/]/,
        name: 'shared-lib',
        priority: 50, // Highest priority
        reuseExistingChunk: true,
      },
    },
  },
  
  // ✅ IMPROVED: Better runtime chunk naming
  runtimeChunk: {
    name: 'runtime',
  },
},
```

**Expected Outcome:**
- **Before:** 1 vendor chunk (1.09 MB) loaded immediately
- **After:** 
  - `vendor-react.js` (~140 KB) - loaded immediately
  - `vendor-mui.js` (~350 KB) - loaded immediately  
  - `vendor-aggrid.js` (~600 KB) - **loaded only when grid route accessed**
  - `vendor-msal.js` (~80 KB) - loaded after authentication
  - `vendor-dates.js` (~120 KB) - loaded when date picker used

**Expected Savings:** ~700 KB deferred from initial load

---

## 🎯 Priority 4: Lazy Load MUI Components (MEDIUM IMPACT)

### Current Problem
All MUI components imported at module level, even rarely-used ones like `ToggleButtonGroup`, `Select`, `MenuItem`.

### Recommendation: Lazy Import Heavy MUI Components

**Example File:** `remote/src/pages/Dashboard/index.tsx`

```typescript
import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";

// ✅ KEEP: Core MUI components needed immediately
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";

// ✅ LAZY LOAD: Heavy/conditional MUI components
const ToggleButtonGroup = lazy(() => 
  import("@mui/material/ToggleButtonGroup").then(m => ({ default: m.default }))
);
const ToggleButton = lazy(() => 
  import("@mui/material/ToggleButton").then(m => ({ default: m.default }))
);
const RadioGroup = lazy(() => 
  import("@mui/material/RadioGroup").then(m => ({ default: m.default }))
);
const FormControlLabel = lazy(() => 
  import("@mui/material/FormControlLabel").then(m => ({ default: m.default }))
);
const Radio = lazy(() => 
  import("@mui/material/Radio").then(m => ({ default: m.default }))
);
const TextField = lazy(() => 
  import("@mui/material/TextField").then(m => ({ default: m.default }))
);
const Select = lazy(() => 
  import("@mui/material/Select").then(m => ({ default: m.default }))
);
const MenuItem = lazy(() => 
  import("@mui/material/MenuItem").then(m => ({ default: m.default }))
);
const Button = lazy(() => 
  import("@mui/material/Button").then(m => ({ default: m.default }))
);

// ✅ KEEP: Shared components from NPM package
import { DataTable, MainContent, DateSelector, theme, fontWeights, apiClient } from "@mfe/shared-lib";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardProps, TabPanelProps, VisibilityRule } from "./types";

// ✅ NEW: Fallback for lazy MUI components (invisible to users)
const MuiFallback = () => <span style={{ display: 'inline-block', minWidth: '20px' }}></span>;

const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  // ... existing state management ...

  return (
    <MainContent>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          {config.tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {config.tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          
          {/* ✅ WRAP: Lazy components in Suspense */}
          {tab.controls?.toggle && shouldShowControl(tab.controls.toggle.visibility, { radioValue, toggleValue }) && (
            <Suspense fallback={<MuiFallback />}>
              <ToggleButtonGroup
                value={toggleValue}
                exclusive
                onChange={(_, val) => val && setToggleValue(val)}
              >
                {tab.controls.toggle.options.map(opt => (
                  <ToggleButton key={opt.value} value={opt.value}>
                    {opt.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Suspense>
          )}

          {/* Similar pattern for other conditional controls */}
          
        </TabPanel>
      ))}
    </MainContent>
  );
};
```

**Expected Savings:** ~50-80 KB per lazy-loaded component (cumulative)

---

## 🎯 Priority 5: Optimize Module Federation (LOW IMPACT, HIGH COMPLEXITY)

### Recommendation: Adjust Shared Dependencies Strategy

**File:** `host/webpack.config.js` & `remote/webpack.config.js`

```javascript
const federationConfig = {
  name: "host", // or "remote"
  remotes: {
    remote: "remote@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    // ✅ CRITICAL: Always eager (used immediately)
    react: { singleton: true, requiredVersion: "^19.2.3", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^19.2.3", eager: true },
    
    // ✅ IMPROVED: Lazy load routing (not needed until navigation)
    "react-router-dom": {
      singleton: true,
      requiredVersion: "^7.9.6",
      eager: false, // Changed from eager: true
    },
    
    // ✅ KEEP: Lazy load UI libraries
    "@mui/material": { singleton: true, requiredVersion: "^6.3.0", eager: false },
    "@mui/icons-material": { singleton: true, requiredVersion: "^6.3.0", eager: false },
    
    // ✅ IMPROVED: Lazy load date pickers (only needed in specific forms)
    "@mui/x-date-pickers": { 
      singleton: true, 
      requiredVersion: "^8.22.0", 
      eager: false,
      requiredVersion: false, // Allow version mismatch to prevent duplication
    },
    
    // ✅ IMPROVED: Lazy load AG Grid (only needed in dashboards)
    "ag-grid-react": { 
      singleton: true, 
      requiredVersion: "^34.3.1", 
      eager: false,
      requiredVersion: false,
    },
    "ag-grid-community": { 
      singleton: true, 
      requiredVersion: "^34.3.1", 
      eager: false,
      requiredVersion: false,
    },
    
    // ✅ IMPROVED: Lazy load authentication (only after user interaction)
    "@azure/msal-browser": { 
      singleton: true, 
      requiredVersion: "^4.26.2", 
      eager: false,
      requiredVersion: false,
    },
    "@azure/msal-react": { 
      singleton: true, 
      requiredVersion: "^3.0.24", 
      eager: false,
      requiredVersion: false,
    },
    
    // ✅ KEEP: Other shared dependencies as lazy
    "date-fns": { singleton: true, requiredVersion: "^4.1.0", eager: false },
    "@emotion/react": { singleton: true, requiredVersion: "^11.14.0", eager: false },
    "@emotion/styled": { singleton: true, requiredVersion: "^11.14.0", eager: false },
    axios: { singleton: true, requiredVersion: "^1.7.9", eager: false },
    "@tanstack/react-query": { singleton: true, requiredVersion: "^5.90.10", eager: false },
  },
};
```

**Expected Savings:** ~200-400 KB deferred from initial bundle

---

## 📊 Implementation Roadmap

### Phase 1 (Week 1): Route-Level Splitting ⚡ HIGHEST ROI
1. ✅ Apply Priority 1: Lazy load wrapper components
2. ✅ Apply Priority 2: Lazy load remote Dashboard
3. ✅ Verify bundle sizes: `npm run build`
4. ✅ Test all routes work correctly

**Expected Reduction:** ~1.5-2 MB from initial bundle

---

### Phase 2 (Week 2): Vendor Splitting
1. ✅ Apply Priority 3: Configure splitChunks
2. ✅ Test chunk loading in browser DevTools (Network tab)
3. ✅ Verify performance metrics (Lighthouse)

**Expected Reduction:** Additional ~700 KB deferred

---

### Phase 3 (Week 3): Component-Level Optimization
1. ✅ Apply Priority 4: Lazy load MUI components in Dashboard
2. ✅ Apply similar pattern to Reports and Analytics pages
3. ✅ Measure bundle size reduction per page

**Expected Reduction:** Additional ~150-300 KB

---

### Phase 4 (Week 4): Fine-Tuning
1. ✅ Apply Priority 5: Optimize Module Federation shared config
2. ✅ Run full bundle analysis with `webpack-bundle-analyzer`
3. ✅ Document final bundle sizes

**Expected Reduction:** Additional ~200-400 KB

---

## 🔧 Tools for Validation

### 1. Install Webpack Bundle Analyzer

```bash
cd host
npm install --save-dev webpack-bundle-analyzer

cd ../remote
npm install --save-dev webpack-bundle-analyzer
```

### 2. Add Analysis Script

**File:** `host/package.json` & `remote/package.json`

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:analyze": "webpack --mode production --env analyze",
    "dev": "webpack serve --mode development"
  }
}
```

### 3. Update Webpack Config

**File:** `host/webpack.config.js` & `remote/webpack.config.js`

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
  const isAnalyze = env && env.analyze;
  
  return {
    // ... existing config ...
    plugins: [
      new Dotenv({ systemvars: true }),
      new ModuleFederationPlugin(federationConfig),
      new FederatedTypesPlugin({ /* ... */ }),
      new HtmlWebpackPlugin({ /* ... */ }),
      
      // ✅ NEW: Bundle analyzer (production only)
      ...(isAnalyze ? [new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,
      })] : []),
    ],
  };
};
```

### 4. Run Analysis

```bash
npm run build:analyze
```

This opens an interactive treemap showing exact bundle composition.

---

## 📈 Expected Results Summary

| Optimization | Current Size | Optimized Size | Savings |
|-------------|-------------|----------------|---------|
| **Host Initial Bundle** | 4.0 MB | 1.5-2.0 MB | **50-62%** |
| **Remote Initial Bundle** | 4.8 MB | 2.0-2.5 MB | **48-58%** |
| **AG Grid Chunk** | 1.09 MB (eager) | 1.09 MB (lazy) | **Deferred** |
| **MUI Components** | ~350 KB (eager) | ~200 KB initial | **43%** |
| **MSAL Auth** | ~80 KB (eager) | ~80 KB (lazy) | **Deferred** |

---

## ⚠️ Important Notes

1. **Test After Each Phase**: Lazy loading can break runtime if module resolution fails
2. **Monitor Network Waterfall**: Ensure lazy chunks load in parallel, not sequentially
3. **Preload Critical Chunks**: Consider adding `<link rel="preload">` for routes user is likely to visit
4. **Cache Optimization**: Use long-term caching (`contenthash`) for vendor chunks
5. **Development vs Production**: Keep development builds fast; apply optimizations only in production

---

## 🎓 Additional Best Practices

### Use Preloading for Predicted Routes

```typescript
// In navigation handler
const handleNavClick = (route: string) => {
  // Preload chunk before navigation
  import(/* webpackPrefetch: true */ `./components/${route}`);
  navigate(route);
};
```

### Monitor Performance

Add to `package.json`:

```json
{
  "scripts": {
    "perf": "lighthouse http://localhost:3000 --view --only-categories=performance"
  }
}
```

### Set Performance Budgets

**File:** `webpack.config.js`

```javascript
performance: {
  maxEntrypointSize: 512000, // 500 KB
  maxAssetSize: 512000,
  hints: 'warning',
},
```

---

## 📚 References

- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [React Lazy Loading](https://react.dev/reference/react/lazy)
- [Module Federation Best Practices](https://module-federation.github.io/blog/best-practices)
- [Web.dev Performance](https://web.dev/performance/)

---

**Next Steps:**
1. Review this document with your team
2. Start with Phase 1 (highest ROI)
3. Measure baseline performance before changes
4. Track improvements after each phase
5. Update this document with actual results
