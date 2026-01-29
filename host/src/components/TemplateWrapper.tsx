/**
 * Template Wrapper Component - Updated for component-level pageConfig loading
 *
 * Wrapper for template-based screens that fetches its own configuration.
 * This component will handle template-specific functionality and configuration.
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { apiEndpoints } from "../config/api";

interface TemplateWrapperProps {
  pageName: string;
  moduleCode: string;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ pageName, moduleCode }) => {
  // Fetch pageConfig for this specific template
  const {
    data: pageConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pageConfig", moduleCode, pageName],
    queryFn: () => apiEndpoints.getPageConfig(moduleCode, pageName),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading template configuration...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error loading template
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {pageName}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Template functionality will be implemented here.
        </Typography>
        <Typography variant="caption" display="block">
          Module: {moduleCode}
        </Typography>
        {pageConfig && (
          <Typography variant="caption" display="block">
            PageConfig loaded: {Object.keys(pageConfig).length} properties
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TemplateWrapper;
