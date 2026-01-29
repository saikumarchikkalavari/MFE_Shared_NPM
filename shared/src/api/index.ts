/**
 * API Utilities and Configuration
 * 
 * This module exports ONLY custom API utilities and configured clients.
 * Consumers should install axios and @tanstack/react-query themselves.
 */

// API Client configuration and utilities
export { createApiClient, apiClient, setUserAdGroupIds, getUserAdGroupIds } from "./axiosInstance";

// Query Client configuration
export { queryClient } from "./queryClient";

// Mock API Utilities (custom helpers)
export { createMockApi, createMockPaginatedApi } from "./mockApi";
