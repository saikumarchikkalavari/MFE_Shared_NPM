/**
 * Placeholder Screen Component
 *
 * A generic placeholder component that adapts to different screen types.
 * This component provides "Coming Soon" messaging with screen-specific context
 * and serves as a foundation for future Module Federation remote components.
 *
 * FUTURE MIGRATION STRATEGY:
 * When implementing actual screens, follow this pattern:
 * 1. Create remote component in remote app (e.g., remote/src/pages/Recalculation)
 * 2. Expose it in remote webpack config: './Recalculation': './src/pages/Recalculation'
 * 3. Update ComponentFactory to lazy load: const Recalculation = lazy(() => import('remote/Recalculation'))
 * 4. Replace PlaceholderScreen with actual remote component in factory
 */

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { fontTokens } from "@mfe/shared-lib";
import { PlaceholderScreenProps, ScreenType } from "../types";
import { getScreenTypeInfo } from "../services";
import { getGroupDisplayName } from "../utils";

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  screenType,
  routeName,
  groupKey,
}) => {
  const screenInfo = getScreenTypeInfo(screenType);
  const groupDisplayName = getGroupDisplayName(groupKey);

  // Determine display title based on screen type and route
  const getDisplayTitle = (): string => {
    if (screenType === ScreenType.TEMPLATES) {
      return groupDisplayName; // Just "Templates"
    }
    return routeName; // "Recalculation", "View Data", etc.
  };

  // Get appropriate icon component name for screen type
  const getIconComponent = () => {
    // These would be actual MUI icons when we import the Icons object
    const iconMap = {
      [ScreenType.DASHBOARD]: "📊",
      [ScreenType.RECALCULATION]: "🔄",
      [ScreenType.VIEW_DATA]: "📋",
      [ScreenType.UPLOADS]: "📤",
      [ScreenType.AUDIT_TABLE]: "📝",
      [ScreenType.TEMPLATES]: "📄",
      [ScreenType.PLACEHOLDER]: "🚧",
    };

    return iconMap[screenType] || iconMap[ScreenType.PLACEHOLDER];
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Paper elevation={3} sx={{ maxWidth: 600, textAlign: "center", p: 4 }}>
        {/* Screen Type Icon */}
        <Box sx={{ fontSize: fontTokens["4xl"], mb: 2 }}>{getIconComponent()}</Box>

        {/* Screen Title */}
        <Typography variant="h3" gutterBottom>
          {getDisplayTitle()}
        </Typography>

        {/* Group Context */}
        {screenType !== ScreenType.TEMPLATES && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {groupDisplayName}
          </Typography>
        )}

        {/* Screen Description */}
        <Typography variant="body1" sx={{ mt: 3, mb: 3, color: "text.secondary" }}>
          {screenInfo.description}
        </Typography>

        {/* Coming Soon Message */}
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          This feature is under development and will be available soon.
        </Typography>

        {/* Migration Note for Developers */}
        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: "info.light",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "info.main",
            }}
          >
            <Typography variant="caption" sx={{ color: "info.contrastText", display: "block" }}>
              <strong>Dev Note:</strong> To implement this screen:
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "info.contrastText", display: "block", mt: 1 }}
            >
              1. Create remote component: remote/src/pages/{screenInfo.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "info.contrastText", display: "block" }}>
              2. Update webpack exposes: './{screenInfo.name}': './src/pages/{screenInfo.name}'
            </Typography>
            <Typography variant="caption" sx={{ color: "info.contrastText", display: "block" }}>
              3. Update ComponentFactory to lazy load remote component
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PlaceholderScreen;

