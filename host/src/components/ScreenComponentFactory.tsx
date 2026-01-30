/**
 * Component Factory - Updated to work with pageConfig directly
 *
 * Business logic for creating appropriate screen components based on detected screen types.
 * Handles component selection, lazy loading, and error boundaries.
 */

import React, { Suspense, lazy } from "react";
import { CircularProgress, Box } from "@mui/material";
import { SCREEN_REGISTRY } from "../services";
import { ScreenType } from "../types";
import PlaceholderScreen from "./PlaceholderScreen";

// Lazy load heavy components with remote dependencies
const DashboardWrapper = lazy(() => import("./DashboardWrapper"));
const TemplateWrapper = lazy(() => import("./TemplateWrapper"));
const RecalculationWrapper = lazy(() => import("./RecalculationWrapper"));

// Better loading fallback
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

/**
 * Creates appropriate screen component based on page information
 * Components handle their own pageConfig loading
 */
export const createScreenComponent = (pageName: string, moduleCode: string): React.ReactElement => {
  // Direct registry lookup for screens
  const screenType = SCREEN_REGISTRY[pageName] || ScreenType.PLACEHOLDER;

  // Route to appropriate component based on screen type
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
