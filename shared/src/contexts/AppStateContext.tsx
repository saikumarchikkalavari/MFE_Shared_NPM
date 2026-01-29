/**
 * Cross-MFE App State Context
 * 
 * This context provides a scalable foundation for sharing data across Module Federation
 * applications. It supports current user permissions needs while being extensible
 * for future shared data requirements (theme, notifications, settings, etc.).
 * 
 * Key Features:
 * - Generic, type-safe data sharing
 * - Optimized re-renders via React.memo and useCallback
 * - Extensible for any future shared data needs
 * - Maintains proper MFE architectural boundaries
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  AppState,
  AppStateContextValue,
  AppStateAction,
} from '../types/appState';

// Create the context with proper TypeScript typing
const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

/**
 * AppState reducer function
 * Handles all state updates in a predictable, immutable way
 */
const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        [action.key]: action.payload,
      };
    
    case 'CLEAR_DATA':
      if (action.key) {
        // Clear specific key
        const { [action.key]: _, ...restState } = state;
        return restState;
      } else {
        // Clear entire state
        return {};
      }
    
    case 'RESET_STATE':
      return {};
    
    default:
      return state;
  }
};

/**
 * AppStateProvider Component
 * 
 * Wraps the application to provide shared state context.
 * Should be placed high in the component tree (typically in App.tsx).
 * 
 * @param children - Child components that need access to shared state
 */
export const AppStateProvider: React.FC<{ 
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}> = ({ children, initialState = {} }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // Memoized update function to prevent unnecessary re-renders
  const updateAppState = useCallback((key: keyof AppState, data: any) => {
    dispatch({ type: 'UPDATE_DATA', key, payload: data });
  }, []) as <T>(key: keyof AppState, data: T) => void;

  // Memoized data getter with type safety
  const getAppData = useCallback((key: keyof AppState) => {
    return state[key];
  }, [state]) as <T>(key: keyof AppState) => T | undefined;

  // Memoized clear function
  const clearAppData = useCallback((key?: keyof AppState) => {
    dispatch({ type: 'CLEAR_DATA', key });
  }, []);

  // Memoized existence checker
  const hasAppData = useCallback((key: keyof AppState): boolean => {
    return key in state && state[key] !== undefined && state[key] !== null;
  }, [state]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AppStateContextValue>(() => ({
    state,
    updateAppState,
    getAppData,
    clearAppData,
    hasAppData,
  }), [state, updateAppState, getAppData, clearAppData, hasAppData]);

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

/**
 * useAppState Hook
 * 
 * Provides access to the shared app state context.
 * Throws an error if used outside of AppStateProvider.
 * 
 * @returns AppStateContextValue - The complete context API
 */
export const useAppState = (): AppStateContextValue => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

/**
 * AppStateDataLoader Component
 * 
 * Helper component for loading data into the shared context.
 * Useful for populating context with data from API calls or other sources.
 * 
 * @param data - Data to load into the context
 * @param onDataLoaded - Optional callback when data is loaded
 */
export const AppStateDataLoader: React.FC<{
  data: Record<keyof AppState, any>;
  onDataLoaded?: () => void;
}> = React.memo(({ data, onDataLoaded }) => {
  const { updateAppState } = useAppState();

  React.useEffect(() => {
    // Load all provided data into context
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updateAppState(key as keyof AppState, value);
      }
    });

    // Call callback if provided
    onDataLoaded?.();
  }, [data, updateAppState, onDataLoaded]);

  return null; // This component doesn't render anything
});

/**
 * withAppState HOC
 * 
 * Higher-order component that provides app state to wrapped components.
 * Alternative to using the hook directly.
 * 
 * @param WrappedComponent - Component to wrap with app state access
 * @returns Enhanced component with app state props
 */
export const withAppState = <P extends object>(
  WrappedComponent: React.ComponentType<P & { appState: AppStateContextValue }>
): React.FC<P> => {
  const WithAppStateComponent: React.FC<P> = (props) => {
    const appState = useAppState();
    return <WrappedComponent {...props} appState={appState} />;
  };

  WithAppStateComponent.displayName = `withAppState(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAppStateComponent;
};

/**
 * AppStateDebugger Component (Development Only)
 * 
 * Useful for debugging shared state during development.
 * Shows current state in console or on screen.
 */
export const AppStateDebugger: React.FC<{
  showInConsole?: boolean;
  showOnScreen?: boolean;
  prefix?: string;
}> = ({ showInConsole = false, showOnScreen = false, prefix = '🔍 AppState' }) => {
  const { state } = useAppState();

  React.useEffect(() => {
    if (showInConsole) {
      console.log(`${prefix}:`, state);
    }
  }, [state, showInConsole, prefix]);

  if (showOnScreen && process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto',
        zIndex: 9999,
      }}>
        <strong>{prefix}</strong>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    );
  }

  return null;
};
