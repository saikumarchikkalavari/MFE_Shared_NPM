import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

// Create singleton MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    console.log("MSAL initialized successfully");
  } catch (error) {
    console.error("MSAL initialization failed:", error);
  }
};
