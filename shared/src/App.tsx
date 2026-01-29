import React from "react";
import { Container, Box, Paper, Typography, Button, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

const App: React.FC = () => {
  const navItems = [
    {
      id: "components",
      label: "Components",
      children: [
        {
          id: "buttons",
          label: "Buttons",
          onClick: () => console.log("Buttons clicked"),
        },
        {
          id: "typography",
          label: "Typography",
          onClick: () => console.log("Typography clicked"),
        },
        {
          id: "forms",
          label: "Forms",
          onClick: () => console.log("Forms clicked"),
        },
      ],
    },
    {
      id: "api",
      label: "API Utilities",
      onClick: () => console.log("API clicked"),
    },
    {
      id: "auth",
      label: "Authentication",
      onClick: () => console.log("Auth clicked"),
    },
    {
      id: "grid",
      label: "Data Grid",
      onClick: () => console.log("Grid clicked"),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <SideNav navItems={navItems} title="Shared Components" />

        <Header title="Shared MFE Components Library" />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginTop: "64px", // Account for header height
            marginLeft: "240px", // Account for drawer width
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Shared Components Demo
            </Typography>
            <Typography variant="body1" paragraph>
              This MFE provides shared MUI components that can be used by both Host and Remote apps.
            </Typography>

            <Box sx={{ mt: 4, display: "grid", gap: 3 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Button Component Variants
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <Button color="primary" variant="contained">
                    Primary
                  </Button>
                  <Button color="primary" variant="contained" disabled>
                    Primary Disabled
                  </Button>
                  <Button color="secondary" variant="contained">
                    Secondary
                  </Button>
                  <Button color="secondary" variant="contained" disabled>
                    Secondary Disabled
                  </Button>
                  <Button color="success" variant="contained">
                    Success
                  </Button>
                  <Button color="error" variant="contained">
                    Error
                  </Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                </Box>
              </Paper>

              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Button Sizes
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                </Box>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                  <Typography variant="h1" gutterBottom>
                    Heading 1
                  </Typography>
                  <Typography variant="h2" gutterBottom>
                    Heading 2
                  </Typography>
                  <Typography variant="h3" gutterBottom>
                    Heading 3
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    Heading 4
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Heading 5
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Heading 6
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
