import React from "react";
import { Container, Paper, Typography, Box, Button, ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@mfe/shared-lib";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Remote Application
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Standalone Mode - Using Shared MUI Components
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Buttons from Shared MFE:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Button clicked from Remote app!")}
              >
                Click Me!
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
              <Button variant="contained" color="success">
                Success
              </Button>
              <Button variant="contained" color="error">
                Error
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: "info.lighter", borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              <strong>Note:</strong> This remote app uses MUI components directly from the Shared
              MFE. All components automatically use the centralized theme.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
