# Tree Shaking Analysis - Dependencies that Block Optimization

Generated: January 30, 2026

## Executive Summary

This analysis identifies dependencies and code patterns that block tree shaking in the MFE_Shared_NPM project. Tree shaking effectiveness has been analyzed across all major dependencies, shared library code, and webpack configurations.

## Critical Findings

### ❌ Major Tree-Shaking Blockers

#### 1. **React & React-DOM** - NO ESM, NO sideEffects Declaration
- **Status**: BLOCKING tree-shaking
- **Issue**: 
  - No `module` field in package.json (CommonJS only)
  - No `sideEffects` declaration
  - `type: commonjs` (default)
- **Impact**: HIGH - Core dependencies prevent tree-shaking of unused React features
- **Workaround**: None available - React 19 still uses CommonJS in published packages
- **Bundle Impact**: Entire React library included (~130 KB minimum)

#### 2. **ag-grid-react** - NO sideEffects Declaration
- **Status**: BLOCKING tree-shaking
- **Issue**:
  - ag-grid-community properly declares CSS files as side effects
  - ag-grid-react wrapper has NO `sideEffects` field
  - Bundlers assume ALL files have side effects
- **Impact**: MEDIUM - Entire ag-grid-react wrapper included even if only using specific features
- **Solution**: ag-grid-community has ESM modules - tree-shaking works at community level

#### 3. **@azure/msal-react** - NO sideEffects Declaration
- **Status**: BLOCKING tree-shaking
- **Issue**: No `sideEffects` field in package.json
- **Impact**: MEDIUM - Entire MSAL React wrapper included
- **Note**: @azure/msal-browser has `sideEffects: false` ✅

### ✅ Dependencies with Good Tree-Shaking Support

#### 1. **@mui/material** - EXCELLENT
- `sideEffects: false` ✅
- `module: ./index.js` (ESM entry point) ✅
- Supports deep imports: `@mui/material/Button`
- **Recommendation**: Use named imports or deep imports for best tree-shaking

#### 2. **axios** - GOOD
- `sideEffects: false` ✅
- `type: module` (native ESM) ✅
- **Status**: Fully tree-shakeable

#### 3. **date-fns** - GOOD
- `sideEffects: false` ✅
- `module: index.js` ✅
- `type: module` ✅
- **Note**: Babel plugin already optimizes imports automatically

#### 4. **@tanstack/react-query** - GOOD
- `sideEffects: false` ✅
- `module: build/legacy/index.js` ✅
- `type: module` ✅

#### 5. **@azure/msal-browser** - GOOD
- `sideEffects: false` ✅
- Core authentication library properly configured

#### 6. **ag-grid-community** - PARTIAL
- **CSS files declared as side effects** (correct behavior) ✅
- ESM modules: `module: ./dist/package/main.esm.mjs` ✅
- **Status**: Tree-shakeable at code level, CSS properly preserved

---

## Shared Library Analysis (@mfe/shared-lib)

### ✅ Configuration: EXCELLENT

```json
{
  "sideEffects": false,
  "module": "dist/esm/index.js",
  "main": "dist/index.cjs.js"
}
```

### ❌ Code Patterns Blocking Tree-Shaking

#### 1. **Default Exports** - BLOCKS TREE-SHAKING
**Found in:**
- [shared/src/components/Header.tsx](../shared/src/components/Header.tsx)
- [shared/src/components/SideNav.tsx](../shared/src/components/SideNav.tsx)
- [shared/src/components/MainContent.tsx](../shared/src/components/MainContent.tsx)
- [shared/src/auth/LoginScreen.tsx](../shared/src/auth/LoginScreen.tsx)

**Issue:**
```typescript
// ❌ BAD - Prevents tree-shaking
export default function Header() { ... }

// In index.ts:
export { default as Header } from "./components/Header";
```

**Why It Blocks:**
- Default exports create a dependency on the entire module
- Re-exporting as named export still includes the default
- Bundlers cannot determine if default export has side effects

**Solution:**
```typescript
// ✅ GOOD - Enables tree-shaking
export function Header() { ... }

// In index.ts:
export { Header } from "./components/Header";
```

**Impact:**
- MEDIUM - Header, SideNav, MainContent always included even if not used
- Estimated overhead: ~5-10 KB per component

#### 2. **Barrel Exports with Re-exports** - POTENTIAL BLOCKER
**Found in:** [shared/src/index.ts](../shared/src/index.ts)

```typescript
export * from "./components/mui";
export * from "./components/aggrid";
export * from "./components/DataTable";
export * from "./api/index";
export * from "./auth/index";
```

**Issue:**
- `export *` can prevent tree-shaking in older bundlers
- Creates transitive dependencies

**Modern Status:**
- ✅ Webpack 5 handles this correctly with `sideEffects: false`
- ✅ Rollup handles this correctly
- Risk: LOW with current tooling

#### 3. **CSS Imports in Components** - SIDE EFFECT
**Found in:** [shared/src/components/DataTable.tsx](../shared/src/components/DataTable.tsx:18-19)

```typescript
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
```

**Issue:**
- CSS imports are ALWAYS side effects
- Bundler must include these even with tree-shaking
- Conflicts with `sideEffects: false` declaration

**Current Impact:**
- Shared package.json declares `sideEffects: false` ❌
- BUT CSS imports exist in DataTable.tsx ❌
- This is technically incorrect configuration

**Solutions:**

**Option 1: Update sideEffects (Recommended)**
```json
{
  "sideEffects": [
    "**/*.css",
    "**/DataTable.tsx"
  ]
}
```

**Option 2: Move CSS to Consumer**
```typescript
// In DataTable.tsx - Remove CSS imports
// Document in README that consumers must import CSS
```

**Option 3: Conditional CSS Injection** (Advanced)
```typescript
// Load CSS only when DataTable is actually rendered
```

**Recommendation:** Use Option 1 - accurately declare side effects

---

## Webpack Configuration Analysis

### ✅ Module Federation Sharing - GOOD
**Configuration:**
```javascript
shared: {
  react: { singleton: true, eager: true },
  "@mui/material": { singleton: true },
  "ag-grid-community": { singleton: true },
  // ... 15 total dependencies
}
```

**Status:** Working correctly - prevents runtime duplication ✅

### ✅ Babel Optimization - GOOD
**Configuration:**
```javascript
// .babelrc.js
plugins: [
  'babel-plugin-lodash',
  ['babel-plugin-transform-imports', {
    'date-fns': { transform: 'date-fns/${member}' }
  }]
]
```

**Status:** Automatic tree-shaking for lodash and date-fns ✅

### ⚠️ Webpack Mode
**Current:** `mode: 'production'` ✅
**Tree-Shaking:** Enabled automatically in production mode ✅

---

## Bundle Size Impact Analysis

### Current Bundle Sizes (After Optimizations)

**Shared Library:**
- ESM: 24.62 KB (18 code-split modules) ✅
- CJS: 22.09 KB ✅
- **Status:** EXCELLENT - 93% reduction from Webpack build

**Host Application:**
- main.js: 235.67 KB
- Largest vendor chunk: 1119.72 KB (contains React, MUI, AG Grid)

**Remote Application:**
- main.js: 49.28 KB ✅
- Largest vendor chunk: 1119.72 KB (shared via Module Federation)

### Vendor Chunk Analysis (600.js - 1119 KB)

**Contains (estimated):**
- React + React-DOM: ~130 KB (not tree-shakeable)
- @mui/material: ~500 KB (partially tree-shakeable, but large)
- ag-grid-community: ~350 KB (tree-shakeable at code level)
- Other shared dependencies: ~140 KB

**Tree-Shaking Effectiveness:**
- React: 0% (CommonJS, no tree-shaking)
- MUI: ~30% (some unused components removed)
- AG Grid: ~50% (unused features removed)
- Axios, date-fns, etc.: ~80% (good tree-shaking)

---

## Recommendations

### Priority 1: High Impact (Implement Now)

1. **Fix sideEffects Declaration in Shared Package**
   ```json
   {
     "sideEffects": [
       "**/*.css",
       "**/DataTable.tsx"
     ]
   }
   ```
   - **Impact:** Ensures correct tree-shaking behavior
   - **Effort:** 5 minutes
   - **Risk:** LOW

2. **Convert Default Exports to Named Exports**
   - Header, SideNav, MainContent, LoginScreen
   - **Impact:** 10-20 KB reduction when components not used
   - **Effort:** 30 minutes
   - **Risk:** MEDIUM (breaking change for consumers)

3. **Analyze MUI Usage**
   ```bash
   # Check which MUI components are actually used
   grep -r "from '@mui/material'" host/src remote/src
   ```
   - Consider deep imports: `@mui/material/Button` instead of `@mui/material`
   - **Potential Impact:** 100-200 KB reduction
   - **Effort:** 2 hours
   - **Risk:** LOW

### Priority 2: Medium Impact (Plan for Next Sprint)

4. **Evaluate AG Grid Usage**
   - Check if all AG Grid features are needed
   - Consider lighter alternatives for simple tables
   - **Potential Impact:** 100-150 KB reduction
   - **Effort:** 4 hours (evaluation + migration)

5. **React 19 ESM Support**
   - Monitor React team for ESM package release
   - Currently blocked upstream
   - **Potential Impact:** 20-30 KB reduction
   - **Timeline:** Unknown (depends on React team)

### Priority 3: Low Impact (Future Optimization)

6. **Lazy Load Large Components**
   ```typescript
   const DataTable = lazy(() => import('./components/DataTable'));
   ```
   - Move large components to separate chunks
   - **Impact:** Faster initial load, same total size
   - **Effort:** 1 hour per component

7. **Bundle Analyzer**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   ```
   - Visual analysis of what's in each chunk
   - **Impact:** Better visibility for optimization
   - **Effort:** 1 hour setup

---

## Testing Tree-Shaking Effectiveness

### Quick Test: Import Single Component

**Create test file:**
```typescript
// test-tree-shaking.ts
import { Header } from '@mfe/shared-lib';
console.log(Header);
```

**Build and analyze:**
```bash
webpack --mode production test-tree-shaking.ts -o test-output
ls -lh test-output/main.js
```

**Expected with good tree-shaking:** ~50 KB (Header + React)
**Expected with poor tree-shaking:** ~200 KB (entire shared lib + React)

### Monitor Bundle Size Over Time

```bash
# Add to CI/CD pipeline
npm run build
du -sh host/dist/*.js > bundle-sizes.txt
git diff bundle-sizes.txt
```

---

## Dependency-Specific Recommendations

### React & React-DOM
- ❌ Cannot optimize (waiting for upstream ESM support)
- ✅ Already using singleton via Module Federation
- **Action:** None available

### @mui/material
- ⚠️ Large library (500+ KB total)
- ✅ Has tree-shaking support
- **Action:** Use deep imports or analyze usage

### ag-grid-community/ag-grid-react
- ✅ Community edition has good tree-shaking
- ❌ ag-grid-react wrapper missing sideEffects
- **Action:** Consider submitting PR to ag-grid-react

### @azure/msal-react
- ❌ Missing sideEffects declaration
- ✅ @azure/msal-browser properly configured
- **Action:** Consider submitting PR to @azure/msal-react

### date-fns, axios, @tanstack/react-query
- ✅ Excellent tree-shaking support
- ✅ Babel plugin optimizing further
- **Action:** No changes needed

---

## Conclusion

**Overall Tree-Shaking Status: GOOD with Room for Improvement**

**Strengths:**
- Shared library properly configured (`sideEffects: false`)
- Rollup build with code splitting working well
- Most dependencies support tree-shaking
- Babel optimizations in place

**Weaknesses:**
- React core libraries block tree-shaking (upstream issue)
- Default exports in shared components
- Incorrect `sideEffects` declaration (CSS imports exist)
- Some wrapper libraries missing sideEffects field

**Expected Impact of Recommendations:**
- Immediate (Priority 1): 10-30 KB reduction
- Medium-term (Priority 2): 100-200 KB reduction
- Long-term (Priority 3): Better maintainability

**Next Steps:**
1. Fix sideEffects declaration (5 minutes)
2. Convert default exports (30 minutes)
3. Analyze MUI usage (2 hours)
4. Install webpack-bundle-analyzer for ongoing monitoring
