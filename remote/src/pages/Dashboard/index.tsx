/**
 * Dashboard Component (Remote MFE)
 *
 * This component receives configuration with embedded visibility rules from the smart host.
 * It manages local UI state and handles conditional control display based on visibility rules.
 *
 * Key responsibilities:
 * - Render UI elements based on config
 * - Manage local UI state (active tab, control values)
 * - Handle conditional visibility using embedded rules
 * - Handle data fetching and display
 * - Extract columnDefs from API response
 */

import React, { useState, useMemo, useCallback } from "react";

import {
  Box,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataTable, MainContent, DateSelector, theme, fontWeights, apiClient } from "@mfe/shared-lib";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardProps, TabPanelProps, VisibilityRule } from "./types";

/**
 * Utility function to check if a control should be visible based on visibility rules
 */
const shouldShowControl = (
  visibilityRule: VisibilityRule | undefined,
  currentState: any
): boolean => {
  if (!visibilityRule) return true;

  // Check toggle visibility rules
  if (visibilityRule.toggle) {
    if (visibilityRule.toggle.equals && currentState.toggleValue !== visibilityRule.toggle.equals) {
      return false;
    }
    if (
      visibilityRule.toggle.notEquals &&
      currentState.toggleValue === visibilityRule.toggle.notEquals
    ) {
      return false;
    }
  }

  // Check radio visibility rules
  if (visibilityRule.radio) {
    if (visibilityRule.radio.equals && currentState.radioValue !== visibilityRule.radio.equals) {
      return false;
    }
    if (
      visibilityRule.radio.notEquals &&
      currentState.radioValue === visibilityRule.radio.notEquals
    ) {
      return false;
    }
  }

  return true;
};

/**
 * TabPanel Component
 * Simple wrapper for tab content with show/hide logic
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  // Simple state management
  const [activeTab, setActiveTab] = useState(0);

  // Current tab - simple lookup
  const currentTab = config.tabs[activeTab];

  const [radioValue, setRadioValue] = useState(() => {
    return (
      currentTab?.controls?.radio?.defaultValue ||
      currentTab?.controls?.radio?.options?.[0]?.value ||
      ""
    );
  });
  const [toggleValue, setToggleValue] = useState(() => {
    return (
      currentTab?.controls?.toggle?.defaultValue ||
      currentTab?.controls?.toggle?.options?.[0]?.value ||
      ""
    );
  });
  const [dropdownValue, setDropdownValue] = useState(() => {
    return (
      currentTab?.controls?.dropdown?.defaultValue ||
      currentTab?.controls?.dropdown?.options?.[0]?.value ||
      ""
    );
  });
  const [batchDate, setBatchDate] = useState(new Date());

  // Track pause/release state for batch operations
  const [isPaused, setIsPaused] = useState(false);

  // API mutation for pause/release functionality
  // Handles batch processing control
  const pauseReleaseMutation = useMutation({
    mutationFn: async (action: "pause" | "release") => {
      const endpoint = config.pauseReleaseApiEndpoint || "/api/dashboard/pause-release";
      const response = await apiClient.post(endpoint, {
        action,
        timestamp: new Date().toISOString(),
        tabId: currentTab?.id,
        ...queryParams,
      });
      return response.data;
    },
    onSuccess: (data: any, variables: "pause" | "release") => {
      setIsPaused(variables === "pause");
      console.log(`Dashboard ${variables}d successfully`);
    },
    onError: (error: any) => {
      console.error("Pause/Release API error:", error);
      // Optionally show error notification
    },
  });

  // Build query parameters from current control values
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (currentTab?.label) params.tabLabel = currentTab.label;
    if (currentTab?.table) params.table = currentTab.table;
    if (radioValue) params.viewBy = radioValue;
    if (toggleValue) params.view = toggleValue;
    if (dropdownValue) params.timeframe = dropdownValue;
    if (batchDate) params.batchDate = batchDate.toISOString().split("T")[0];
    return params;
  }, [currentTab?.label, currentTab?.table, radioValue, toggleValue, dropdownValue, batchDate]);

  console.log("queryParams:", queryParams);
  // Data fetching with TanStack Query
  // Automatically refetches when tab or control values change
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", currentTab?.id, queryParams],
    queryFn: async () => {
      if (!currentTab) return null;

      const response = await apiClient.get(currentTab.apiEndpoint, {
        params: queryParams,
      });
      return response.data;
    },
    enabled: !!currentTab,
    staleTime: 30000, // Consider data fresh for 30 seconds
    // Fallback to sample data on error for demo purposes
    placeholderData: {
      data: [
        { id: 1, name: "Item 1", value: 100, status: "Active" },
        { id: 2, name: "Item 2", value: 200, status: "Inactive" },
        { id: 3, name: "Item 3", value: 300, status: "Active" },
      ],
      columns: [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 2 },
        { field: "value", headerName: "Value", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
      ],
    },
  });

  // Extract table data and column definitions from API response
  const tableData = useMemo(() => apiResponse?.data || [], [apiResponse]);
  const columnDefs = useMemo(
    () => apiResponse?.columns || currentTab?.columnDefs || [],
    [apiResponse, currentTab]
  );

  // Event Handlers - Update local state only

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);

      // Reset control values when tab changes
      const newTab = config.tabs[newValue];
      setRadioValue(
        newTab?.controls?.radio?.defaultValue || newTab?.controls?.radio?.options?.[0]?.value || ""
      );
      setToggleValue(
        newTab?.controls?.toggle?.defaultValue ||
          newTab?.controls?.toggle?.options?.[0]?.value ||
          ""
      );
      setDropdownValue(
        newTab?.controls?.dropdown?.defaultValue ||
          newTab?.controls?.dropdown?.options?.[0]?.value ||
          ""
      );
    },
    [config.tabs]
  );

  // Radio button change handler
  const handleRadioChange = useCallback((value: string) => {
    setRadioValue(value);
  }, []);

  // Toggle change handler
  const handleToggleChange = useCallback((value: string | null) => {
    if (value !== null) {
      setToggleValue(value);
    }
  }, []);

  // Dropdown change handler
  const handleDropdownChange = useCallback((value: string) => {
    setDropdownValue(value);
  }, []);

  // Batch date change handler
  const handleBatchDateChange = useCallback((value: Date | null) => {
    setBatchDate(value || new Date());
  }, []);

  // Pause/Release action handler
  const handlePauseRelease = useCallback(() => {
    const action = isPaused ? "release" : "pause";
    pauseReleaseMutation.mutate(action);
  }, [isPaused, pauseReleaseMutation]);

  // Header actions for breadcrumb row (refresh time)
  const headerActions = useMemo(() => {
    if (!config.showRefreshTime) return undefined;

    return (
      <Typography variant="caption">
        Last Refreshed:{" "}
        {new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        ,{" "}
        {new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </Typography>
    );
  }, [config.showRefreshTime]);

  // Title actions for title row (calendar, buttons)
  const actions = useMemo(() => {
    if (
      !config.actions ||
      (!config.actions.showBatchDate &&
        !config.actions.showPauseButton &&
        !config.actions.customButtons)
    ) {
      return undefined;
    }

    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {config.actions.showBatchDate && (
          <>
            <Typography variant="body2">Batch Date:</Typography>
            <DateSelector
              value={batchDate}
              onChange={handleBatchDateChange}
              format="dd-MMM-yyyy"
              disablePast
            />
            {(config.actions.showPauseButton || config.actions.customButtons) && (
              <Box sx={{ width: "1px", height: "32px", bgcolor: "divider" }} />
            )}
          </>
        )}
        {config.actions.showPauseButton && (
          <Button
            variant="contained"
            size="small"
            onClick={handlePauseRelease}
            disabled={pauseReleaseMutation.isPending}
          >
            {pauseReleaseMutation.isPending ? (
              <CircularProgress size={16} sx={{ color: "inherit", mr: 1 }} />
            ) : null}
            {isPaused ? "Release" : "Pause"}
          </Button>
        )}
        {config.actions.customButtons?.map((btn, idx) => (
          <Button key={idx} variant={btn.variant || "contained"} size="small">
            {btn.label}
          </Button>
        ))}
      </Box>
    );
  }, [
    config.actions,
    batchDate,
    handleBatchDateChange,
    handlePauseRelease,
    isPaused,
    pauseReleaseMutation.isPending,
  ]);

  // Render tab controls with conditional visibility based on embedded rules
  const renderControls = useCallback(
    (tab: (typeof config.tabs)[0]) => {
      if (!tab.showControls || !tab.controls) return null;

      return (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Radio Buttons */}
          {tab.controls.radio &&
            shouldShowControl(tab.controls.radio.visibleWhen, {
              radioValue,
              toggleValue,
              dropdownValue,
            }) && (
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={radioValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRadioChange(e.target.value)
                  }
                >
                  <Typography
                    component="span"
                    sx={{
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: fontWeights.normal,
                    }}
                  >
                    {tab.controls.radio.label}
                  </Typography>
                  {tab.controls.radio.options.map(option => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

          {/* Right: Toggle Buttons and Conditional Dropdown */}
          {(tab.controls.toggle ||
            (tab.controls.dropdown &&
              shouldShowControl(tab.controls.dropdown.visibleWhen, {
                radioValue,
                toggleValue,
                dropdownValue,
              }))) && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {tab.controls.toggle &&
                shouldShowControl(tab.controls.toggle.visibleWhen, {
                  radioValue,
                  toggleValue,
                  dropdownValue,
                }) && (
                  <ToggleButtonGroup
                    color="primary"
                    value={toggleValue}
                    exclusive
                    onChange={(_event: React.MouseEvent<HTMLElement>, newValue: string | null) =>
                      handleToggleChange(newValue)
                    }
                    size="small"
                  >
                    {tab.controls.toggle.options.map(option => (
                      <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}

              {tab.controls.toggle &&
                tab.controls.dropdown &&
                shouldShowControl(tab.controls.dropdown.visibleWhen, {
                  radioValue,
                  toggleValue,
                  dropdownValue,
                }) && <Box sx={{ width: "1px", height: "32px", bgcolor: "divider" }} />}

              {/* Dropdown - conditionally visible based on embedded rules */}
              {tab.controls.dropdown &&
                shouldShowControl(tab.controls.dropdown.visibleWhen, {
                  radioValue,
                  toggleValue,
                  dropdownValue,
                }) && (
                  <Select
                    value={dropdownValue}
                    onChange={(e: any) => handleDropdownChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    {tab.controls.dropdown.options.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
            </Box>
          )}
        </Box>
      );
    },
    [
      radioValue,
      toggleValue,
      dropdownValue,
      handleRadioChange,
      handleToggleChange,
      handleDropdownChange,
      config,
    ]
  );

  // Render individual tab content with controls and data grid
  const renderTabContent = useCallback(
    (tab: (typeof config.tabs)[0], index: number) => {
      const isCurrentTab = activeTab === index;
      const data = isCurrentTab ? tableData || [] : [];

      return (
        <TabPanel key={tab.id} value={activeTab} index={index}>
          {renderControls(tab)}

          {isCurrentTab && isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataTable
              rowData={data}
              columnDefs={columnDefs}
              pagination={true}
              pageSize={20}
              rowSelection="multiRow"
              height={500}
            />
          )}
          {isCurrentTab && error && (
            <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
              Error loading data. Showing sample data.
            </Typography>
          )}
        </TabPanel>
      );
    },
    [activeTab, isLoading, error, tableData, columnDefs, renderControls, config]
  );

  // Main component render - layout with tabs and content
  return (
    <MainContent
      pageTitle={config.pageTitle}
      subTitle={config.subTitle}
      headerActions={headerActions}
      actions={actions}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {config.tabs.map(tab => (
              <Tab key={tab.id} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {config.tabs.map((tab, index) => renderTabContent(tab, index))}
      </Box>
    </MainContent>
  );
};

export default Dashboard;
