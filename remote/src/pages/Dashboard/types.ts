import React from "react";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface VisibilityRule {
  toggle?: {
    equals?: string;
    notEquals?: string;
  };
  radio?: {
    equals?: string;
    notEquals?: string;
  };
}

export interface DashboardConfig {
  pageTitle: string;
  subTitle?: string;
  showRefreshTime?: boolean;
  pauseReleaseApiEndpoint?: string;
  actions?: {
    showBatchDate?: boolean;
    showPauseButton?: boolean;
    customButtons?: Array<{
      label: string;
      variant?: "contained" | "outlined" | "text";
    }>;
  };
  tabs: Array<{
    id: string;
    label: string;
    table?: string; // Table name for backend queries
    showControls: boolean;
    apiEndpoint: string;
    columnDefs?: any[]; // Optional - comes from API response
    controls?: {
      radio?: {
        label: string;
        options: Array<{ value: string; label: string }>;
        defaultValue?: string;
        visibleWhen?: VisibilityRule;
      };
      toggle?: {
        options: Array<{ value: string; label: string }>;
        defaultValue?: string;
        visibleWhen?: VisibilityRule;
      };
      dropdown?: {
        options: Array<{ value: string; label: string }>;
        defaultValue?: string;
        visibleWhen?: VisibilityRule;
      };
    };
  }>;
}

export interface DashboardState {
  activeTab: number;
  tabStates: Record<string, any>;
}

export interface DashboardProps {
  config: DashboardConfig;
}
