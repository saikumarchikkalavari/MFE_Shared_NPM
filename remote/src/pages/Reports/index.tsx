import React, { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Paper,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { MainContent } from "@mfe/shared-lib";

interface ReportsConfig {
  pageTitle: string;
  subTitle?: string;
  reportTypes: Array<{
    id: string;
    label: string;
    description: string;
    apiEndpoint: string;
    columnDefs: any[];
    filters?: Array<{
      id: string;
      label: string;
      type: "select" | "date" | "text";
      options?: Array<{ value: string; label: string }>;
    }>;
  }>;
  actions?: {
    showExportButton?: boolean;
    showRefreshButton?: boolean;
  };
}

interface ReportsProps {
  config: ReportsConfig;
}

const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({
  children,
  value,
  index,
}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Reports: React.FC<ReportsProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const mockData = useMemo(() => {
    // Generate mock data based on current report type
    const currentReport = config.reportTypes[activeTab];
    if (!currentReport) return [];

    return Array.from({ length: 20 }, (_, i) => {
      const row: any = { id: i + 1 };
      currentReport.columnDefs.forEach(col => {
        if (col.field === "id") return;

        switch (col.field) {
          case "name":
          case "description":
            row[col.field] = `Sample ${col.field} ${i + 1}`;
            break;
          case "amount":
          case "value":
          case "total":
            row[col.field] = (Math.random() * 1000000).toFixed(2);
            break;
          case "date":
          case "createdAt":
            row[col.field] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0];
            break;
          case "status":
            row[col.field] = ["Active", "Inactive", "Pending", "Completed"][
              Math.floor(Math.random() * 4)
            ];
            break;
          case "category":
          case "type":
            row[col.field] = ["Category A", "Category B", "Category C"][
              Math.floor(Math.random() * 3)
            ];
            break;
          default:
            row[col.field] = `Data ${i + 1}`;
        }
      });
      return row;
    });
  }, [activeTab, config.reportTypes]);

  return (
    <MainContent pageTitle={config.pageTitle}>
      <Box sx={{ p: 3 }}>
        {config.subTitle && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {config.subTitle}
          </Typography>
        )}

        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            {config.reportTypes.map(report => (
              <Tab key={report.id} label={report.label} />
            ))}
          </Tabs>

          {config.reportTypes.map((report, index) => (
            <TabPanel key={report.id} value={activeTab} index={index}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>

                {/* Filters */}
                {report.filters && report.filters.length > 0 && (
                  <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                    {report.filters.map(filter => (
                      <FormControl key={filter.id} sx={{ minWidth: 200 }}>
                        <Select
                          value={filters[filter.id] || ""}
                          onChange={(e: any) => handleFilterChange(filter.id, e.target.value)}
                          displayEmpty
                          renderValue={(value: any) => value || filter.label}
                        >
                          {filter.options?.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ))}
                  </Box>
                )}

                {/* Action buttons */}
                {config.actions && (
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    {config.actions.showRefreshButton && (
                      <Button variant="outlined">Refresh Data</Button>
                    )}
                    {config.actions.showExportButton && (
                      <Button variant="contained">Export Report</Button>
                    )}
                  </Box>
                )}

                {/* Data Grid */}
                <Box sx={{ height: 400 }}>
                  <AgGridReact
                    rowData={mockData}
                    columnDefs={report.columnDefs}
                    pagination={true}
                    paginationPageSize={20}
                    animateRows={true}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                  />
                </Box>
              </Box>
            </TabPanel>
          ))}
        </Paper>
      </Box>
    </MainContent>
  );
};

export default Reports;
