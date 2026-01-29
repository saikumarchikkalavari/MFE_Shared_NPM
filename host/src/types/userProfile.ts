/**
 * User Profile Types
 *
 * Type definitions for /me API response and user-related data
 */

/**
 * User profile response from /me API endpoint
 */
export interface UserProfile {
  tenant_id: number;
  ad_groups: string[];
  ad_group_ids: number[];
  // Additional user fields that may be added later:
  // id?: string;
  // name?: string;
  // email?: string;
  // department?: string;
  // role?: string;
  // preferences?: UserPreferences;
}

/**
 * User preferences structure (future extension)
 */
export interface UserPreferences {
  theme?: "light" | "dark";
  language?: string;
  timezone?: string;
  notifications?: {
    email: boolean;
    desktop: boolean;
    mobile: boolean;
  };
}
