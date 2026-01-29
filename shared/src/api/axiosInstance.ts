import axios, { AxiosInstance } from "axios";
import { msalInstance } from "../auth/msalInstance";
import { tokenRequest } from "../auth/authConfig";

const AD_GROUP_IDS_KEY = "user-ad-group-ids";

// Helper functions for ad_group_ids storage
export const setUserAdGroupIds = (adGroupIds: number[]) => {
  sessionStorage.setItem(AD_GROUP_IDS_KEY, JSON.stringify(adGroupIds));
  console.log("🔄 User AD group IDs stored:", adGroupIds);
};

export const getUserAdGroupIds = (): number[] => {
  try {
    const stored = sessionStorage.getItem(AD_GROUP_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const createApiClient = (
  baseURL?: string,
  options?: { enableUserContext?: boolean }
): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || "http://localhost:4000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor with MSAL authentication
  instance.interceptors.request.use(
    async config => {
      console.log("🚀 API CLIENT INTERCEPTOR CALLED:", config.url);

      // 1. Always add MSAL authentication
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account: accounts[0],
          });
          config.headers.Authorization = `Bearer ${response.accessToken}`;

          if (process.env.NODE_ENV === "development") {
            console.log(`✅ Token attached to ${config.method?.toUpperCase()} ${config.url}`);
          }
        } catch (error) {
          console.error("❌ Token acquisition failed:", error);
          try {
            const popupResponse = await msalInstance.acquireTokenPopup(tokenRequest);
            config.headers.Authorization = `Bearer ${popupResponse.accessToken}`;
            console.log("✅ Token acquired via popup fallback");
          } catch (popupError) {
            console.error("❌ Popup token acquisition also failed:", popupError);
          }
        }
      } else {
        console.warn("⚠️ No accounts available for token acquisition");
      }

      // 2. Conditionally add user AD group IDs from sessionStorage
      if (options?.enableUserContext) {
        const adGroupIds = getUserAdGroupIds();
        if (adGroupIds.length > 0) {
          config.headers["X-User-Ad-Group-Ids"] = JSON.stringify(adGroupIds);
          console.log("✅ AD Group IDs added to", config.url, ":", adGroupIds);
        }
      }

      return config;
    },
    (error: any) => {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  instance.interceptors.response.use(
    response => response.data, // Auto-unwrap data
    async (error: any) => {
      if (error.response?.status === 401) {
        console.error("🔐 API Unauthorized (401) - user may need to re-authenticate");
      }

      if (error.response?.status === 403) {
        console.error("🚫 API Forbidden (403): User does not have permission for this resource");
      }

      if (error.response?.status >= 500) {
        console.error("🔥 API Server Error:", error.response?.status, error.response?.data);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Default instance
export const apiClient = createApiClient();
