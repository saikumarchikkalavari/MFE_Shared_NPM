/**
 * Main Application Component
 *
 * This is the root component for the MFE Host application that:
 * - Loads user configuration from API to dynamically generate routes
 * - Creates navigation based on user permissions and available features
 * - Handles routing for Dashboard components and placeholder screens
 * - Uses Module Federation to lazy load shared and remote components
 */

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

// MSAL React authentication components
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsalAuthentication,
  useMsal,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { msalInstance, LoginScreen, tokenRequest, theme } from "@mfe/shared-lib";

// MUI components
import {
  ThemeProvider,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
  CssBaseline,
} from "@mui/material";

// React Query
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient, setUserAdGroupIds } from "@mfe/shared-lib";

// Local API endpoints
import { apiEndpoints } from "./config/api";

// Local services and components
import { generateNavigationItems, getDefaultNavigationPath } from "./services";
import { createScreenComponent } from "./components/ScreenComponentFactory";

// Local types
import type { UserProfile, NavigationConfig } from "./types";

// Local components
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

// Shared components from npm package
import { Header as SharedHeader, SideNav as SharedSideNav } from "@mfe/shared-lib";

/**
 * Automatic Login Component
 * Handles silent authentication attempt and renders appropriate content
 */
const AutoLoginApp: React.FC = () => {
  const { accounts } = useMsal();

  // Only attempt silent auth when no accounts exist
  const shouldAttemptSilent = accounts.length === 0;

  // Conditional silent authentication
  const { result, error } = useMsalAuthentication(
    InteractionType.Silent,
    shouldAttemptSilent ? tokenRequest : undefined
  );

  // Log user details when authentication is successful
  React.useEffect(() => {
    if (accounts.length > 0) {
      const currentAccount = accounts[0];
      console.log("✅ User authenticated:", currentAccount);
    }
  }, [accounts]);

  // Only show loading when actually attempting silent auth
  if (shouldAttemptSilent && !result && !error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // Direct path for users with existing accounts
  if (accounts.length > 0) {
    return (
      <>
        <AuthenticatedTemplate>
          <AppWithNavigation />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <LoginScreen
            title="SMBC Portal"
            subtitle="Please sign in with your company account to access the portal."
          />
        </UnauthenticatedTemplate>
      </>
    );
  }

  // If silent authentication failed, show login screen
  if (error) {
    return (
      <LoginScreen
        title="SMBC Portal"
        subtitle="Please sign in with your company account to access the portal."
      />
    );
  }

  // If authenticated, show main app content
  return (
    <>
      <AuthenticatedTemplate>
        <AppWithNavigation />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginScreen
          title="SMBC Portal"
          subtitle="Please sign in with your company account to access the portal."
        />
      </UnauthenticatedTemplate>
    </>
  );
};

/**
 * App wrapper that fetches user data and navigation config
 * This handles the API call sequence: /me -> /navigationConfig -> AppContent
 */
const AppWithNavigation: React.FC = () => {
  // 1. /me API call
  const {
    data: userProfile,
    isLoading: userLoading,
    error: userError,
  } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: apiEndpoints.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Handle side effect when userProfile is available
  React.useEffect(() => {
    if (userProfile?.ad_group_ids) {
      setUserAdGroupIds(userProfile.ad_group_ids);
      console.log("✅ Ad group IDs stored:", userProfile.ad_group_ids);
    }
  }, [userProfile]);

  // 2. /navigationConfig API call - only after user profile is loaded
  const {
    data: navigationConfig,
    isLoading: navLoading,
    error: navError,
  } = useQuery<NavigationConfig>({
    queryKey: ["navigationConfig"],
    queryFn: apiEndpoints.getNavigationConfig,
    enabled: !!userProfile, // Only run after user profile is loaded
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Combined loading state
  if (userLoading || navLoading) {
    const loadingMessage = userLoading ? "Loading user profile..." : "Loading navigation...";

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {loadingMessage}
        </Typography>
      </Box>
    );
  }

  // Error states
  if (userError || navError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Application
        </Typography>
        <Typography variant="body1">
          {userError ? "Failed to load user profile" : "Failed to load navigation"}
        </Typography>
      </Box>
    );
  }

  // Success - render main app with navigation
  if (navigationConfig) {
    return <AppContent navigationConfig={navigationConfig} />;
  }

  return null;
};

/**
 * Main application content component
 * Components handle their own pageConfig loading
 */
const AppContent: React.FC<{ navigationConfig: NavigationConfig }> = ({ navigationConfig }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate navigation items using navigation service
  const navItems = React.useMemo(() => {
    return generateNavigationItems(navigationConfig, navigate);
  }, [navigationConfig, navigate]);

  // Debug navigation state
  React.useEffect(() => {
    console.log("🧭 Navigation Debug Info:");
    console.log("Current pathname:", location.pathname);
    console.log("Generated nav items:", navItems);
  }, [location.pathname, navItems]);

  // Component factory - components handle their own pageConfig
  const componentFactory = React.useCallback((pageName: string, moduleCode: string) => {
    return createScreenComponent(pageName, moduleCode);
  }, []);

  // Generate routes from navigationConfig
  const renderRoutes = () => {
    if (!navigationConfig?.modules) return null;

    // Filter out removed modules
    const REMOVED_MODULES = ['CARTS', 'USERS', 'REPORTS', 'INTEGRATIONS'];
    const filteredModules = navigationConfig.modules.filter(
      (module: any) => !REMOVED_MODULES.includes(module.module_code)
    );

    return filteredModules
      .map((module: any) => [
        // Routes for modules with pages
        ...(module.pages?.map((page: any) => (
          <Route
            key={`${module.module_code}-${page.page_code}`}
            path={`/${module.module_code.toLowerCase().replace("_", "-")}/${page.page_code.toLowerCase()}`}
            element={
              <ErrorBoundary>
                <Suspense fallback={<CircularProgress />}>
                  {componentFactory(page.page_name, module.module_code)}
                </Suspense>
              </ErrorBoundary>
            }
          />
        )) || []),
        // Route for standalone modules without pages
        (!module.pages || module.pages.length === 0) && (
          <Route
            key={module.module_code}
            path={`/${module.module_code.toLowerCase().replace("_", "-")}`}
            element={
              <ErrorBoundary>
                <Suspense fallback={<CircularProgress />}>
                  {componentFactory(module.module_name, module.module_code)}
                </Suspense>
              </ErrorBoundary>
            }
          />
        ),
      ])
      .flat()
      .filter(Boolean);
  };

  // Get default route using navigation service
  const defaultRoute = React.useMemo(() => {
    return getDefaultNavigationPath(navigationConfig);
  }, [navigationConfig]);

  // Main application layout with navigation and routing
  return (
    <>
      {/* Application Header */}
      <SharedHeader />

      <Box sx={{ display: "flex" }}>
        {/* Side Navigation */}
        <SharedSideNav navItems={navItems} currentPath={location.pathname} />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
        >
          <Toolbar />

          <Routes>
            {/* Default route - redirect to first available route */}
            <Route path="/" element={<Navigate to={defaultRoute} replace />} />

            {/* Dynamic routes using ScreenComponentFactory */}
            {renderRoutes()}

            {/* 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

/**
 * Root App component wrapped with providers
 * Sets up MSAL authentication, React Query, Material-UI theme, and React Router
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      {/* <MsalProvider instance={msalInstance}> */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppWithNavigation />
            {/* <AutoLoginApp /> */}
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      {/* </MsalProvider> */}
    </ErrorBoundary>
  );
};

export default App;
