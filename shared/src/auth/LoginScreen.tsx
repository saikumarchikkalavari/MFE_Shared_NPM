/**
 * Login Screen Component (Shared)
 *
 * Displays a clean SSO login interface for users who need to authenticate.
 * Used for both initial login attempts and authentication error recovery.
 * Configurable with custom title and subtitle for different applications.
 */

import React from "react";
import { Container, Box, Paper, Typography, Button } from "@mui/material";
import { useMsal } from "@azure/msal-react";

interface LoginScreenProps {
  title?: string;
  subtitle?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  title = "Welcome",
  subtitle = "Please sign in with your company account to access the portal.",
}) => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup({ scopes: ["User.Read"] });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ minWidth: 200 }}
          >
            Sign in with Company SSO
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginScreen;
