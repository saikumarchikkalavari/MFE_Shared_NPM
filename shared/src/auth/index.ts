/**
 * Auth Configuration and Utilities
 * 
 * This module exports ONLY custom auth configuration and utilities.
 * Consumers should install @azure/msal-browser and @azure/msal-react themselves.
 */

// Custom auth configuration
export { msalConfig, loginRequest, tokenRequest } from "./authConfig";
export { msalInstance, initializeMsal } from "./msalInstance";
export { authService } from "./authService";

// Custom auth component
export { LoginScreen } from "./LoginScreen";
