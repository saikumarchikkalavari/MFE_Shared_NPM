import React from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { MainContent } from "@mfe/shared-lib";

interface AnalyticsConfig {
  pageTitle: string;
  subTitle?: string;
  widgets: Array<{
    id: string;
    title: string;
    type: "chart" | "metric" | "table";
    size: "small" | "medium" | "large";
    config: any;
  }>;
  timeRanges?: Array<{
    value: string;
    label: string;
  }>;
  actions?: {
    showRefreshButton?: boolean;
    showFullScreenButton?: boolean;
  };
}

interface AnalyticsProps {
  config: AnalyticsConfig;
}

const Analytics: React.FC<AnalyticsProps> = ({ config }) => {
  const getGridSize = (size: string) => {
    switch (size) {
      case "small":
        return { xs: 12, sm: 6, md: 4 };
      case "medium":
        return { xs: 12, sm: 6, md: 6 };
      case "large":
        return { xs: 12, md: 8 };
      default:
        return { xs: 12, sm: 6, md: 6 };
    }
  };

  const generateMockData = (widget: any) => {
    switch (widget.type) {
      case "metric":
        return {
          value: Math.floor(Math.random() * 1000000),
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.5 ? "up" : "down",
        };
      case "table":
        return Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          status: ["Active", "Inactive"][Math.floor(Math.random() * 2)],
        }));
      case "chart":
        return Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          value: Math.floor(Math.random() * 100),
        }));
      default:
        return null;
    }
  };

  const renderWidget = (widget: any) => {
    const data = generateMockData(widget);

    switch (widget.type) {
      case "metric":
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {widget.title}
            </Typography>
            <Typography variant="h3" color="primary">
              {(data as any)?.value?.toLocaleString() || "0"}
            </Typography>
            <Typography
              variant="body2"
              color={(data as any)?.trend === "up" ? "success.main" : "error.main"}
            >
              {(data as any)?.change > 0 ? "+" : ""}
              {((data as any)?.change || 0).toFixed(1)}% vs last period
            </Typography>
          </Paper>
        );

      case "table":
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {widget.title}
            </Typography>
            <Box sx={{ height: 300 }}>
              <AgGridReact
                rowData={data as any}
                columnDefs={[
                  { field: "id", headerName: "ID", width: 80 },
                  { field: "name", headerName: "Name", flex: 1 },
                  { field: "value", headerName: "Value", width: 100 },
                  { field: "status", headerName: "Status", width: 100 },
                ]}
                pagination={false}
                animateRows={true}
              />
            </Box>
          </Paper>
        );

      case "chart":
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {widget.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chart visualization would be rendered here
            </Typography>
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
                mt: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                📊 Chart Component ({(data as any)?.length || 0} data points)
              </Typography>
            </Box>
          </Paper>
        );

      default:
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Unknown Widget Type</Typography>
          </Paper>
        );
    }
  };

  return (
    <MainContent pageTitle={config.pageTitle}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {config.pageTitle}
            </Typography>
            {config.subTitle && (
              <Typography variant="h6" color="text.secondary">
                {config.subTitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {config.timeRanges && (
              <Button
                variant="outlined"
                onClick={() => {
                  /* Time range selector */
                }}
              >
                {config.timeRanges?.find(tr => tr.value === "7d")?.label || "Last 7 days"}
              </Button>
            )}

            {config.actions?.showRefreshButton && <Button variant="outlined">Refresh</Button>}

            {config.actions?.showFullScreenButton && (
              <Button variant="outlined">Full Screen</Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {config.widgets.map(widget => {
            const gridSize = getGridSize(widget.size);
            return (
              <Grid item key={widget.id} {...gridSize}>
                {renderWidget(widget)}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </MainContent>
  );
};

export default Analytics;
