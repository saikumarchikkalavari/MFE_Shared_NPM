import { Configuration, PopupRequest } from "@azure/msal-browser";

// Azure AD MSAL Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "your-client-id",
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || "your-tenant-id"}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage", // 'localStorage' or 'sessionStorage'
    storeAuthStateInCookie: false,
  },
};

// Scopes for login
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Scopes for API access token - consistent with login for full user profile
export const tokenRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};
