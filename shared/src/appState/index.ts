/**
 * Cross-MFE App State Module
 *
 * This module exports all the components, hooks, and types needed for
 * sharing data across Module Federation applications.
 *
 * Usage:
 * ```typescript
 * // In host App.tsx
 * import { AppStateProvider } from 'shared/AppState';
 *
 * // In any MFE component
 * import { useSharedUser, useSharedTheme } from 'shared/AppState';
 * ```
 */

// Core context and provider
export {
  AppStateProvider,
  useAppState,
  AppStateDataLoader,
  withAppState,
  AppStateDebugger,
} from "../contexts/AppStateContext";

// Typed hooks for common data patterns
export {
  useSharedUser,
  useSharedTheme,
  useSharedNotifications,
  useSharedSettings,
  useSharedNavigation,
  useSharedPermissions,
  createSharedDataHook,
  useSharedFeatureFlags,
} from "../hooks/useSharedData";

// Type definitions
export type {
  AppState,
  AppStateContextValue,
  AppStateAction,
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

// Re-export for convenience
export * from "../contexts/AppStateContext";
export * from "../hooks/useSharedData";
export * from "../types/appState";
