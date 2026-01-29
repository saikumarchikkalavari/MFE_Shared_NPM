/**
 * Typed Hooks for Cross-MFE Shared Data
 *
 * This module provides convenient, type-safe hooks for common shared data patterns.
 * Each hook encapsulates specific data domains while maintaining the underlying
 * generic AppState architecture.
 *
 * Current domains:
 * - User (profile, permissions, preferences)
 * - Theme (UI appearance, colors, typography)
 * - Notifications (alerts, messages, counts)
 * - Settings (application preferences)
 * - Navigation (current path, breadcrumbs)
 *
 * Future domains can be easily added by following the same patterns.
 */

import { useCallback, useMemo } from "react";
import { useAppState } from "../contexts/AppStateContext";
import {
  UserProfile,
  UserPreferences,
  NotificationItem,
  ThemeConfig,
  AppSettings,
  SharedUserHook,
  SharedThemeHook,
  SharedNotificationsHook,
  SharedSettingsHook,
} from "../types/appState";

/**
 * useSharedUser Hook
 *
 * Provides access to user-related data across all MFEs.
 * Handles user profile, permissions, and preferences.
 *
 * @returns SharedUserHook - User data and update functions
 */
export const useSharedUser = (): SharedUserHook => {
  const { getAppData, updateAppState } = useAppState();

  const userData = getAppData<{ profile?: UserProfile; permissions?: string[]; preferences?: UserPreferences }>("user") || {};
  const { profile, permissions = [], preferences } = userData;

  // Memoized update functions
  const updateUserProfile = useCallback(
    (newProfile: UserProfile) => {
      updateAppState("user", { ...userData, profile: newProfile });
    },
    [updateAppState, userData]
  );

  const updateUserPermissions = useCallback(
    (newPermissions: string[]) => {
      updateAppState("user", { ...userData, permissions: newPermissions });
    },
    [updateAppState, userData]
  );

  const updateUserPreferences = useCallback(
    (newPreferences: UserPreferences) => {
      updateAppState("user", { ...userData, preferences: newPreferences });
    },
    [updateAppState, userData]
  );

  // Permission checker
  const hasPermission = useCallback(
    (permission: string) => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const isLoggedIn = useMemo(() => {
    return !!(profile?.id || profile?.localAccountId);
  }, [profile]);

  return {
    userProfile: profile,
    userPermissions: permissions,
    userPreferences: preferences,
    updateUserProfile,
    updateUserPermissions,
    updateUserPreferences,
    hasPermission,
    isLoggedIn,
  };
};

/**
 * useSharedTheme Hook
 *
 * Provides access to theme and UI preferences across all MFEs.
 * Handles light/dark mode, custom colors, and typography settings.
 *
 * @returns SharedThemeHook - Theme data and update functions
 */
export const useSharedTheme = (): SharedThemeHook => {
  const { getAppData, updateAppState } = useAppState();

  const themeData = getAppData<ThemeConfig>("theme") || { mode: "light" };

  const setThemeMode = useCallback(
    (mode: "light" | "dark") => {
      updateAppState("theme", { ...themeData, mode });
    },
    [updateAppState, themeData]
  );

  const setCustomColors = useCallback(
    (colors: Record<string, string>) => {
      updateAppState("theme", { ...themeData, customColors: colors });
    },
    [updateAppState, themeData]
  );

  const toggleTheme = useCallback(() => {
    const newMode = themeData.mode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  }, [themeData.mode, setThemeMode]);

  return {
    themeMode: themeData.mode,
    customColors: themeData.customColors,
    typography: themeData.typography,
    setThemeMode,
    setCustomColors,
    toggleTheme,
  };
};

/**
 * useSharedNotifications Hook
 *
 * Provides access to notification system across all MFEs.
 * Handles alerts, messages, unread counts, and notification management.
 *
 * @returns SharedNotificationsHook - Notification data and management functions
 */
export const useSharedNotifications = (): SharedNotificationsHook => {
  const { getAppData, updateAppState } = useAppState();

  const notificationData = getAppData<{ items: NotificationItem[]; unreadCount: number }>("notifications") || { items: [], unreadCount: 0 };

  const addNotification = useCallback(
    (notification: Omit<NotificationItem, "id" | "timestamp">) => {
      const newNotification: NotificationItem = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };

      const updatedItems = [...notificationData.items, newNotification];
      const updatedUnreadCount = notificationData.unreadCount + (notification.read ? 0 : 1);

      updateAppState("notifications", {
        items: updatedItems,
        unreadCount: updatedUnreadCount,
      });
    },
    [updateAppState, notificationData]
  );

  const markAsRead = useCallback(
    (notificationId: string) => {
      const updatedItems = notificationData.items.map(item =>
        item.id === notificationId ? { ...item, read: true } : item
      );

      const wasUnread = notificationData.items.find(
        item => item.id === notificationId && !item.read
      );

      const updatedUnreadCount = wasUnread
        ? Math.max(0, notificationData.unreadCount - 1)
        : notificationData.unreadCount;

      updateAppState("notifications", {
        items: updatedItems,
        unreadCount: updatedUnreadCount,
      });
    },
    [updateAppState, notificationData]
  );

  const markAllAsRead = useCallback(() => {
    const updatedItems = notificationData.items.map(item => ({ ...item, read: true }));

    updateAppState("notifications", {
      items: updatedItems,
      unreadCount: 0,
    });
  }, [updateAppState, notificationData.items]);

  const removeNotification = useCallback(
    (notificationId: string) => {
      const notificationToRemove = notificationData.items.find(item => item.id === notificationId);
      const updatedItems = notificationData.items.filter(item => item.id !== notificationId);

      const updatedUnreadCount =
        notificationToRemove && !notificationToRemove.read
          ? Math.max(0, notificationData.unreadCount - 1)
          : notificationData.unreadCount;

      updateAppState("notifications", {
        items: updatedItems,
        unreadCount: updatedUnreadCount,
      });
    },
    [updateAppState, notificationData]
  );

  const clearAllNotifications = useCallback(() => {
    updateAppState("notifications", {
      items: [],
      unreadCount: 0,
    });
  }, [updateAppState]);

  return {
    notifications: notificationData.items,
    unreadCount: notificationData.unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };
};

/**
 * useSharedSettings Hook
 *
 * Provides access to application settings across all MFEs.
 * Handles user preferences, configuration options, and feature flags.
 *
 * @returns SharedSettingsHook - Settings data and update functions
 */
export const useSharedSettings = (): SharedSettingsHook => {
  const { getAppData, updateAppState } = useAppState();

  const settings = getAppData<AppSettings>("settings");

  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      updateAppState("settings", updatedSettings);
    },
    [updateAppState, settings]
  );

  const getSetting = useCallback(
    <T>(key: keyof AppSettings): T | undefined => {
      return settings?.[key] as T;
    },
    [settings]
  );

  const setSetting = useCallback(
    <T>(key: keyof AppSettings, value: T) => {
      const updatedSettings = { ...settings, [key]: value };
      updateAppState("settings", updatedSettings);
    },
    [updateAppState, settings]
  );

  return {
    settings,
    updateSettings,
    getSetting,
    setSetting,
  };
};

/**
 * useSharedNavigation Hook
 *
 * Provides access to navigation state across all MFEs.
 * Handles current path, breadcrumbs, and navigation preferences.
 *
 * @returns Navigation data and update functions
 */
export const useSharedNavigation = () => {
  const { getAppData, updateAppState } = useAppState();

  const navigationData = getAppData<{ currentPath?: string; breadcrumbs?: Array<{ label: string; path: string }>; sideNavCollapsed?: boolean }>("navigation") || {};

  const updateCurrentPath = useCallback(
    (path: string) => {
      updateAppState("navigation", { ...navigationData, currentPath: path });
    },
    [updateAppState, navigationData]
  );

  const updateBreadcrumbs = useCallback(
    (breadcrumbs: Array<{ label: string; path: string }>) => {
      updateAppState("navigation", { ...navigationData, breadcrumbs });
    },
    [updateAppState, navigationData]
  );

  const setSideNavCollapsed = useCallback(
    (collapsed: boolean) => {
      updateAppState("navigation", { ...navigationData, sideNavCollapsed: collapsed });
    },
    [updateAppState, navigationData]
  );

  return {
    currentPath: navigationData?.currentPath,
    breadcrumbs: navigationData?.breadcrumbs || [],
    sideNavCollapsed: navigationData?.sideNavCollapsed || false,
    updateCurrentPath,
    updateBreadcrumbs,
    setSideNavCollapsed,
  };
};

/**
 * useSharedPermissions Hook
 *
 * Specialized hook for permission checking across MFEs.
 * Provides convenient methods for authorization logic.
 *
 * @returns Permission checking utilities
 */
export const useSharedPermissions = () => {
  const { userPermissions } = useSharedUser();

  const hasPermission = useCallback(
    (permission: string) => {
      return userPermissions?.includes(permission) || false;
    },
    [userPermissions]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      return permissions.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      return permissions.every(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const getPermissionLevel = useCallback(
    (permissionPrefix: string) => {
      const levels = ["READ", "WRITE", "ADMIN"];
      const userLevels = userPermissions
        ?.filter(p => p.startsWith(permissionPrefix))
        .map(p => p.replace(permissionPrefix + "_", ""))
        .filter(level => levels.includes(level));

      return userLevels || [];
    },
    [userPermissions]
  );

  return {
    userPermissions: userPermissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionLevel,
  };
};

/**
 * Custom hook factory for creating domain-specific hooks
 *
 * @param domain - The domain key in AppState
 * @returns Custom hook for that domain
 */
export const createSharedDataHook = <T>(domain: string) => {
  return () => {
    const { getAppData, updateAppState } = useAppState();

    const data = getAppData<T>(domain);

    const updateData = useCallback(
      (newData: Partial<T>) => {
        const updatedData = { ...data, ...newData };
        updateAppState(domain, updatedData);
      },
      [data, updateAppState]
    );

    const setData = useCallback(
      (newData: T) => {
        updateAppState(domain, newData);
      },
      [updateAppState]
    );

    return {
      data,
      updateData,
      setData,
    };
  };
};

// Example: Create a custom hook for feature flags
export const useSharedFeatureFlags = createSharedDataHook<Record<string, boolean>>("featureFlags");
