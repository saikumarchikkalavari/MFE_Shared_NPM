import { msalInstance } from "./msalInstance";
import { AccountInfo } from "@azure/msal-browser";

// Simplified auth service for account management across MFEs
// Token acquisition is now handled directly by createApiClient
export const authService = {
  // Get active account
  getAccount: (): AccountInfo | null => {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  },

  // Logout
  logout: async (): Promise<void> => {
    const account = authService.getAccount();
    try {
      await msalInstance.logoutPopup({ account: account || undefined });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return authService.getAccount() !== null;
  },
};
