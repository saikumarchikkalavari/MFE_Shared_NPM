/**
 * Component Factory - Updated to work with pageConfig directly
 *
 * Business logic for creating appropriate screen components based on detected screen types.
 * Handles component selection, lazy loading, and error boundaries.
 */

import React, { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { SCREEN_REGISTRY } from "../services";
import { ScreenType } from "../types";
import PlaceholderScreen from "./PlaceholderScreen";
import DashboardWrapper from "./DashboardWrapper";
import TemplateWrapper from "./TemplateWrapper";
import RecalculationWrapper from "./RecalculationWrapper";

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
        <Suspense fallback={<CircularProgress />}>
          <DashboardWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    case ScreenType.TEMPLATES:
      return (
        <Suspense fallback={<CircularProgress />}>
          <TemplateWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    case ScreenType.RECALCULATION:
      return (
        <Suspense fallback={<CircularProgress />}>
          <RecalculationWrapper pageName={pageName} moduleCode={moduleCode} />
        </Suspense>
      );

    default:
      return (
        <PlaceholderScreen screenType={screenType} routeName={pageName} groupKey={moduleCode} />
      );
  }
};
