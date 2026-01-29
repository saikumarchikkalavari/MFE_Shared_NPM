/**
 * Cross-MFE Shared State Type Definitions
 *
 * This file defines the interface for sharing data across Module Federation applications.
 * It provides a generic, extensible foundation for current user permissions sharing
 * and future shared data requirements (theme, notifications, settings, etc.).
 */

// Base user profile interface (extend as needed)
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  localAccountId?: string;
  tenantId?: string;
  ad_group_ids?: string[];
  [key: string]: any; // Allow additional user properties
}

// User preferences interface
export interface UserPreferences {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  theme?: "light" | "dark" | "auto";
  notifications?: {
    email: boolean;
    browser: boolean;
    desktop: boolean;
  };
  [key: string]: any; // Allow additional preferences
}

// Notification item interface
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Theme configuration interface
export interface ThemeConfig {
  mode: "light" | "dark";
  customColors?: Record<string, string>;
  typography?: {
    fontFamily?: string;
    fontSize?: number;
  };
  spacing?: number;
  borderRadius?: number;
}

// Application settings interface
export interface AppSettings {
  autoSave?: boolean;
  defaultPageSize?: number;
  compactMode?: boolean;
  showTutorials?: boolean;
  [key: string]: any; // Allow additional settings
}

/**
 * Main AppState interface - Generic and extensible
 *
 * This interface can accommodate any type of shared data across MFEs.
 * New shared data types can be added without breaking existing code.
 */
export interface AppState {
  // User-related data
  user?: {
    profile?: UserProfile;
    permissions?: string[];
    preferences?: UserPreferences;
  };

  // Theme and UI preferences
  theme?: ThemeConfig;

  // Notification system
  notifications?: {
    unreadCount: number;
    items: NotificationItem[];
  };

  // Application settings
  settings?: AppSettings;

  // Navigation state (for cross-MFE navigation)
  navigation?: {
    currentPath?: string;
    breadcrumbs?: Array<{ label: string; path: string }>;
    sideNavCollapsed?: boolean;
  };

  // Generic extensibility - any new shared data can be added here
  [key: string]: any;
}

/**
 * Context value interface for AppStateContext
 *
 * Provides methods for updating and retrieving shared state data
 * with full TypeScript support.
 */
export interface AppStateContextValue {
  // Current state snapshot
  state: AppState;

  // Update any key in the app state
  updateAppState: <T>(key: keyof AppState, data: T) => void;

  // Get typed data from app state
  getAppData: <T>(key: keyof AppState) => T | undefined;

  // Clear specific key or entire state
  clearAppData: (key?: keyof AppState) => void;

  // Check if data exists for a key
  hasAppData: (key: keyof AppState) => boolean;
}

/**
 * Action types for AppState reducer
 */
export type AppStateAction =
  | { type: "UPDATE_DATA"; key: keyof AppState; payload: any }
  | { type: "CLEAR_DATA"; key?: keyof AppState }
  | { type: "RESET_STATE" };

/**
 * Hook return types for common shared data patterns
 */
export interface SharedUserHook {
  userProfile?: UserProfile;
  userPermissions?: string[];
  userPreferences?: UserPreferences;
  updateUserProfile: (profile: UserProfile) => void;
  updateUserPermissions: (permissions: string[]) => void;
  updateUserPreferences: (preferences: UserPreferences) => void;
  hasPermission: (permission: string) => boolean;
  isLoggedIn: boolean;
}

export interface SharedThemeHook {
  themeMode: "light" | "dark";
  customColors?: Record<string, string>;
  typography?: ThemeConfig["typography"];
  setThemeMode: (mode: "light" | "dark") => void;
  setCustomColors: (colors: Record<string, string>) => void;
  toggleTheme: () => void;
}

export interface SharedNotificationsHook {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

export interface SharedSettingsHook {
  settings?: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getSetting: <T>(key: keyof AppSettings) => T | undefined;
  setSetting: <T>(key: keyof AppSettings, value: T) => void;
}
