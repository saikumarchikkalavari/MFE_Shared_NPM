/**
 * Dashboard Wrapper Component - Updated for component-level pageConfig loading
 *
 * This wrapper implements the "smart" host pattern for MFE architecture.
 * It fetches its own pageConfig and generates Dashboard configuration.
 *
 * Key responsibilities:
 * - Fetch pageConfig for the specific page
 * - Generate dashboard configuration from pageConfig
 * - Transform pageConfig into Dashboard component format
 * - Handle loading and error states
 */

import React, { useMemo, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import { apiEndpoints } from "../config/api";
import { generateDashboardConfigFromPageConfig } from "../services/config";
import type { PageConfig } from "../types";

// Import Dashboard component from remote MFE
const Dashboard = lazy(() => import("remote/Dashboard") as Promise<{ default: React.ComponentType<any> }>);

interface DashboardWrapperProps {
  pageName: string;
  moduleCode: string;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ pageName, moduleCode }) => {
  // Fetch pageConfig for this specific page
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

  // Generate dashboard configuration from pageConfig
  const dashboardConfig = useMemo(() => {
    if (!pageConfig) {
      return {
        pageTitle: pageName,
        showRefreshTime: true,
        tabs: [],
        activeTab: "",
        actions: {
          showBatchDate: false,
          showPauseButton: false,
        },
      };
    }

    return generateDashboardConfigFromPageConfig(pageName, pageConfig);
  }, [pageName, pageConfig]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading {pageName} configuration...
        </Typography>
      </Box>
    );
  }

  // Error state
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

  console.log("Rendering DashboardWrapper with config:", dashboardConfig);

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <Dashboard config={dashboardConfig} />
    </Suspense>
  );
};

export default DashboardWrapper;
