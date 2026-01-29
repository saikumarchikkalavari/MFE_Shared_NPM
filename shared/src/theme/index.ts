import { createTheme } from "@mui/material/styles";

// Extend Material-UI theme types to include custom properties
declare module "@mui/material/styles" {
  interface TypeBackground {
    tertiary: string;
  }
}

export const brandColors = {
  // Primary & Secondary Brand Colors
  primary: "#344972", // Calm Navy
  secondary: "#387F97", // Storm Blue
  tertiary: "#FFFFFF", // White

  // State Colors
  success: "#336D5A", // Teal Green 80
  error: "#FD3333", // Red 80
  warning1: "#FFB733", // Orange 90
  warning2: "#FFD9D9", // Red 15

  // Background Colors
  primaryBg: "#EFF4FF", // Background Default
  secondaryBg: "#FFFFFF", // White
  tertiaryBg: "#D7D5CE", // Soft Grey
  highlights: "#C7EEFC", // Blue Pale

  // Text Colors
  primaryText1: "#262626", // Black 85
  primaryText2: "#344972", // Calm Navy (Primary-2)
  secondaryText: "#FFFFFF", // White
  warningText: "#FF0000", // Red
};

// Generic design tokens - reusable typography system
export const fontTokens = {
  xs: "0.75rem", // 12px - breadcrumbs, small text
  sm: "0.875rem", // 14px - navigation, secondary text
  base: "1rem", // 16px - tabs, body text, icons
  lg: "1.5rem", // 24px - page titles, headings
  xl: "2rem", // 32px - large headings, hero text
  "4xl": "4rem", // 64px - large display elements
};

export const fontWeights = {
  light: 300, // Light text
  normal: 400, // Default weight
  bold: 700, // Emphasis, selected states
};

export const lineHeights = {
  tight: 1.25, // Compact text (breadcrumbs)
  normal: "normal", // Standard line height
};

// Custom theme for MFE Multi - Based on Design System
export const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary, // #344972 (Calm Navy)
      dark: brandColors.primaryText2, // #344972 (for primary colored text)
    },
    secondary: {
      main: brandColors.secondary, // #387F97 (Storm Blue)
    },
    success: {
      main: brandColors.success, // #336D5A (Teal Green 80)
    },
    error: {
      main: brandColors.error, // #FD3333 (Red 80)
      dark: brandColors.warningText, // #FF0000 (for error text)
    },
    warning: {
      main: brandColors.warning1, // #FFB733 (Orange 90)
      light: brandColors.warning2, // #FFD9D9 (Red 15)
    },
    info: {
      main: brandColors.highlights, // #C7EEFC (Blue Pale - for highlight backgrounds)
    },
    background: {
      default: brandColors.primaryBg, // #EFF4FF (Background Default)
      paper: brandColors.secondaryBg, // #FFFFFF (White)
      tertiary: brandColors.tertiaryBg, // #D7D5CE (Soft Grey)
    },
    text: {
      primary: brandColors.primaryText1, // #262626 (Black 85)
      secondary: brandColors.secondaryText, // #FFFFFF (White)
    },
    common: {
      white: brandColors.tertiary, // #FFFFFF (White)
      black: brandColors.primaryText1, // #262626 (Black 85)
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    allVariants: {
      // Color will be inherited from theme.palette.text.primary
    },
    h1: {
      fontSize: "2.5rem", // Keep existing - larger than our xl token
      fontWeight: fontWeights.bold,
      lineHeight: 1.2,
      // Color inherited from theme.palette.text.primary
    },
    h2: {
      fontSize: fontTokens.xl, // 2rem (32px)
      fontWeight: fontWeights.bold,
      lineHeight: 1.3,
      // Color inherited from theme.palette.text.primary
    },
    h3: {
      fontSize: "1.75rem", // Keep existing - between lg and xl
      fontWeight: fontWeights.bold,
      lineHeight: 1.4,
      // Color inherited from theme.palette.text.primary
    },
    h4: {
      fontSize: fontTokens.lg, // 1.5rem (24px) - page titles
      fontWeight: fontWeights.normal,
      lineHeight: 1.4,
      // Color inherited from theme.palette.text.primary
    },
    h5: {
      fontSize: "1.25rem", // Keep existing - between base and lg
      fontWeight: fontWeights.bold,
      lineHeight: 1.5,
      // Color inherited from theme.palette.text.primary
    },
    h6: {
      fontSize: fontTokens.base, // 1rem (16px) - tabs
      fontWeight: fontWeights.bold,
      lineHeight: 1.6,
      // Color inherited from theme.palette.text.primary
    },
    button: {
      fontWeight: fontWeights.normal,
    },
    body1: {
      fontSize: fontTokens.base, // 1rem (16px)
      // Color inherited from theme.palette.text.primary
    },
    body2: {
      fontSize: fontTokens.sm, // 0.875rem (14px) - navigation
      // Color inherited from theme.palette.text.primary
    },
    caption: {
      fontSize: fontTokens.xs, // 0.75rem (12px) - breadcrumbs
      // Color inherited from theme.palette.text.primary
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          // Will use theme.palette.secondary.main and automatically calculate contrast text
          "&:hover": {
            // Material-UI will handle hover state automatically
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Will use default AppBar styling from theme
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Will inherit color from theme.palette.text.primary
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 48,
        }),
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          height: 2,
          borderRadius: "2px 2px 0 0",
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontWeight: fontWeights.normal,
          fontSize: fontTokens.base,
          textTransform: "none",
          minHeight: 48,
          padding: "12px 24px",
          "&.Mui-selected": {
            color: theme.palette.primary.main,
            fontWeight: fontWeights.bold,
          },
          "&:hover": {
            color: theme.palette.primary.main,
            opacity: 0.8,
          },
        }),
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          // Will inherit color from theme.palette.text.primary
          "&.Mui-focused": {
            // Will inherit focused color from theme
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          // Will inherit color from theme.palette.text.primary
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-checked": {
            color: theme.palette.secondary.main,
          },
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.tertiary,
          borderRadius: "20px",
          padding: "4px",
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: "transparent",
          border: "none",
          textTransform: "none",
          borderRadius: "16px !important",
          padding: "8px 24px",
          fontSize: fontTokens.base,
          fontWeight: fontWeights.normal,
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
            fontWeight: fontWeights.bold,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          },
          "&:hover": {
            backgroundColor: "transparent",
          },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: "24px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderRadius: "24px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
        select: ({ theme }) => ({
          padding: "8px 32px 8px 20px",
          fontSize: fontTokens.base,
          fontWeight: fontWeights.bold,
          color: theme.palette.primary.main,
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Date picker specific styling
          '&[data-date-picker="true"]': {
            minWidth: 150,
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              backgroundColor: theme.palette.background.paper,
              "& fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              padding: "8px 14px",
              fontWeight: fontWeights.bold,
              color: theme.palette.primary.main,
            },
          },
        }),
      },
    },
  },
});

export default theme;
