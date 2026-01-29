import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fontTokens } from "@mfe/shared-lib";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Typography variant="h1" gutterBottom color="error">
            ⚠️
          </Typography>
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
            An unexpected error occurred while loading the application. Please try refreshing the
            page or contact support if the problem persists.
          </Typography>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                textAlign: "left",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <Typography variant="caption" component="pre" sx={{ fontSize: fontTokens.xs }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" onClick={this.handleReload}>
              Reload Page
            </Button>
            <Button variant="outlined" onClick={this.handleGoHome}>
              Go Home
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
