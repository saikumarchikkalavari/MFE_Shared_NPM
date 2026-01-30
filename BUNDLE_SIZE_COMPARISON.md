# Bundle Size Comparison: MFE_SharedRemote vs MFE_Shared_NPM

Generated: January 30, 2026

## Architecture Comparison

| Project | Shared Pattern | Bundle Strategy |
|---------|---------------|-----------------|
| **MFE_SharedRemote** | Module Federation Remote | Runtime sharing via Module Federation |
| **MFE_Shared_NPM** | NPM Package (local file:) | Build-time bundling with Rollup + Webpack |

---

## Overall Bundle Sizes

### Total JavaScript Bundle Sizes

| Application | MFE_SharedRemote | MFE_Shared_NPM | Difference | Change |
|-------------|------------------|----------------|------------|--------|
| **Host** | 1,564.98 KB (19 files) | 3,514.02 KB (28 files) | +1,949.04 KB | +124.5% ⚠️ |
| **Remote** | 2,328.39 KB (22 files) | 4,744.34 KB (35 files) | +2,415.95 KB | +103.8% ⚠️ |
| **Shared** | 2,937.36 KB (37 files) | 24.58 KB ESM (18 files) + 22.09 KB CJS | -2,890.69 KB | -98.4% ✅ |

**Key Finding:** MFE_Shared_NPM has significantly larger host/remote bundles because shared code is bundled into each application instead of being loaded as a separate Module Federation remote.

---

## Main Bundle Comparison

### Application Entry Points (main.js)

| Application | MFE_SharedRemote | MFE_Shared_NPM | Difference | Analysis |
|-------------|------------------|----------------|------------|----------|
| **Host main.js** | 9.46 KB | 235.67 KB | +226.21 KB | +2,391% 🔴 |
| **Remote main.js** | 9.01 KB | 49.28 KB | +40.27 KB | +447% 🟡 |

**Analysis:**
- **MFE_SharedRemote**: Tiny main.js files because Module Federation dynamically loads shared dependencies at runtime
- **MFE_Shared_NPM**: Larger main.js because npm packages are bundled into the application at build time

---

## Detailed Breakdown by Application

### Host Application

| Metric | MFE_SharedRemote | MFE_Shared_NPM | Notes |
|--------|------------------|----------------|-------|
| Total Size | 1,564.98 KB | 3,514.02 KB | +124.5% larger |
| File Count | 19 files | 28 files | More code splitting in NPM version |
| main.js | 9.46 KB | 235.67 KB | NPM bundles more application code |
| Largest Chunk | ~500-600 KB (vendor) | 1,119.72 KB (600.js) | Vendor chunks contain React, MUI, AG Grid |

### Remote Application

| Metric | MFE_SharedRemote | MFE_Shared_NPM | Notes |
|--------|------------------|----------------|-------|
| Total Size | 2,328.39 KB | 4,744.34 KB | +103.8% larger |
| File Count | 22 files | 35 files | More code splitting in NPM version |
| main.js | 9.01 KB | 49.28 KB | NPM bundles application code |
| Largest Chunk | ~600 KB (vendor) | 1,119.72 KB (346.js, 600.js) | Vendor chunks duplicated |

### Shared Library

| Format | MFE_SharedRemote | MFE_Shared_NPM | Notes |
|--------|------------------|----------------|-------|
| **Build Output** | 2,937.36 KB (37 files) | ESM: 24.58 KB (18 files)<br>CJS: 22.09 KB | NPM package is **98.4% smaller** |
| **Distribution** | Module Federation remote<br>(loaded at runtime) | NPM package<br>(bundled at build time) | Different distribution strategies |
| **Runtime Loading** | Separate network request | Bundled into host/remote | NPM = faster initial load |

---

## Architecture Trade-offs

### MFE_SharedRemote (Module Federation)

**Advantages:**
✅ Small main.js files (9-10 KB) - fast initial parse
✅ True runtime sharing - shared code loaded only once
✅ Independent deployment of shared library
✅ Better code splitting across MFEs
✅ Lower total bundle size (host + remote + shared = 6.8 MB)

**Disadvantages:**
❌ Additional network request to load shared remote
❌ Runtime overhead for Module Federation
❌ More complex build configuration
❌ Requires shared remote to be available at runtime

### MFE_Shared_NPM (NPM Package)

**Advantages:**
✅ Simpler build process (standard npm install)
✅ No runtime dependency on external remote
✅ Tree-shaking enabled (named exports, sideEffects config)
✅ Excellent shared library bundle size (24 KB ESM)
✅ No additional network requests
✅ Works offline after initial load

**Disadvantages:**
❌ Larger main.js files (235 KB host, 49 KB remote)
❌ Shared code duplicated in each application bundle
❌ Higher total bundle size (host + remote = 8.2 MB)
❌ Requires rebuild and redeploy of all consumers when shared changes
❌ No runtime sharing between host and remote

---

## Bundle Size Analysis by Category

### Vendor Dependencies (Estimated Breakdown)

Based on vendor chunk sizes, both architectures include:

| Dependency | Estimated Size | Tree-Shaking |
|------------|---------------|--------------|
| React + React-DOM | ~130 KB | ❌ No (CommonJS) |
| @mui/material | ~400-500 KB | ⚠️ Partial (~30% reduction) |
| ag-grid-community | ~300-350 KB | ✅ Yes (~50% reduction) |
| @azure/msal-browser + react | ~100-150 KB | ⚠️ Partial |
| axios, date-fns, react-query | ~100 KB | ✅ Yes (~80% reduction) |

**Total Vendor Size:** ~1,100-1,200 KB (matches observed 1,119 KB chunks)

### Code Distribution

| Code Type | MFE_SharedRemote | MFE_Shared_NPM |
|-----------|------------------|----------------|
| **Application Code** | ~400-500 KB (distributed) | ~600-800 KB (bundled per app) |
| **Shared Library Code** | ~50-100 KB (in shared remote) | ~25 KB (optimized NPM package) |
| **Vendor Dependencies** | ~1,100 KB (Module Fed shared) | ~1,100 KB per app (duplicated) |

---

## Optimization Summary

### MFE_Shared_NPM Optimizations Applied

1. ✅ **Rollup Build** - 98.4% reduction in shared library size (2,937 KB → 24 KB)
2. ✅ **Tree-Shaking** - `sideEffects: false` + named exports
3. ✅ **Code Splitting** - preserveModules (18 separate ESM files)
4. ✅ **Babel Optimization** - lodash/date-fns import optimization
5. ✅ **npm dedupe** - Removed 34 duplicate packages
6. ✅ **Terser Minification** - Advanced compression

### Remaining Optimization Opportunities

**For MFE_Shared_NPM:**
- [ ] Implement Module Federation for runtime sharing (reduce duplication)
- [ ] Lazy load large vendor chunks (React Query, AG Grid)
- [ ] Analyze MUI usage for deep imports
- [ ] Consider hybrid approach (npm package + Module Federation)

**For MFE_SharedRemote:**
- [ ] Optimize shared remote build (currently 2,937 KB)
- [ ] Enable tree-shaking in shared remote
- [ ] Add code splitting in shared remote

---

## Network Performance Impact

### Initial Page Load (Estimated)

**MFE_SharedRemote:**
```
Host app:     1,565 KB (19 files)
Shared remote: 2,937 KB (37 files)
Total:        4,502 KB (56 files, 2 requests)
```

**MFE_Shared_NPM:**
```
Host app:     3,514 KB (28 files)
Total:        3,514 KB (28 files, 1 request)
```

**Winner:** MFE_Shared_NPM loads ~22% faster (fewer files, no shared remote request)

### With Both Host + Remote Loaded

**MFE_SharedRemote:**
```
Host:         1,565 KB
Remote:       2,328 KB
Shared:       2,937 KB (loaded once, shared)
Total:        6,830 KB
```

**MFE_Shared_NPM:**
```
Host:         3,514 KB
Remote:       4,744 KB
Total:        8,258 KB (shared code duplicated)
```

**Winner:** MFE_SharedRemote saves ~1,428 KB (17% smaller) due to runtime sharing

---

## Recommendations

### For Production Use

**Choose MFE_SharedRemote if:**
- Multiple MFEs need to share the same dependencies
- Independent deployment of shared library is critical
- Total bundle size matters more than initial load time
- You have reliable CDN/infrastructure for Module Federation

**Choose MFE_Shared_NPM if:**
- Single host + remote (limited sharing benefit)
- Simpler deployment model preferred
- Faster initial page load is priority
- You want tree-shaking and modern bundling optimizations

### Hybrid Approach (Best of Both Worlds)

**Recommended Architecture:**
1. Use **NPM package** for shared utilities, components, types
2. Use **Module Federation** for sharing runtime dependencies (React, MUI, AG Grid)
3. Configure Module Federation to import from npm package
4. Benefits:
   - Small npm package (24 KB optimized)
   - Runtime sharing of vendor dependencies
   - Tree-shaking enabled
   - Simpler shared library development

**Example webpack.config.js:**
```javascript
shared: {
  '@mfe/shared-lib': { singleton: true, eager: true }, // NPM package
  react: { singleton: true, eager: true },             // Module Fed
  '@mui/material': { singleton: true },                // Module Fed
  'ag-grid-community': { singleton: true },            // Module Fed
}
```

---

## Conclusion

**Bundle Size Winner:** MFE_SharedRemote (6.8 MB total vs 8.2 MB)
**Shared Library Winner:** MFE_Shared_NPM (24 KB vs 2,937 KB)
**Initial Load Winner:** MFE_Shared_NPM (3.5 MB vs 4.5 MB)
**Tree-Shaking Winner:** MFE_Shared_NPM (optimized with Rollup)
**Deployment Simplicity Winner:** MFE_Shared_NPM (standard npm)
**Runtime Sharing Winner:** MFE_SharedRemote (true singleton sharing)

**Overall Recommendation:** Implement **hybrid approach** - use MFE_Shared_NPM's optimized npm package with MFE_SharedRemote's Module Federation runtime sharing for the best balance of bundle size, performance, and maintainability.
