import { createApiClient, createMockApi } from "@mfe/shared-lib";
import { mockUserProfile } from "../mocks/userConfig.mock";
import { mockNavigationConfig } from "../mocks/navigationConfig.mock";
import { mockPageConfig } from "../mocks/pageConfig.mock";

// Create API clients with user context enabled
export const userApiClient = createApiClient("https://user-service.company.com", {
  enableUserContext: true,
});

// Simplified API endpoints - only what you need
export const apiEndpoints = {
  // 1. /me API - load user profile and ad_group_ids
  getMe: () => createMockApi(mockUserProfile, { delay: 400 }),

  // 2. /navigationConfig API - get sidebar navigation structure
  getNavigationConfig: () => createMockApi(mockNavigationConfig, { delay: 300 }),

  // 3. /pageConfig API - get page-specific configuration
  getPageConfig: (moduleCode: string, pageCode: string) =>
    createMockApi(mockPageConfig, { delay: 200 }),
};
