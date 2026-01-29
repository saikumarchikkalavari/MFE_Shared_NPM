import React from "react";
import { Box, Typography } from "@mui/material";

// 404 Not Found component
const NotFound: React.FC = () => (
  <Box
    sx={{
      p: 4,
      textAlign: "center",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography variant="h1" gutterBottom color="error">
      404
    </Typography>
    <Typography variant="h4" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
      The page you're looking for doesn't exist or may have been moved.
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Available routes are dynamically generated based on your group permissions.
    </Typography>
  </Box>
);

export default NotFound;
