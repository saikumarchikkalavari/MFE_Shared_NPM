import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { fontWeights } from "../theme";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.background.paper,
  },
  "&:focus-within": {
    borderColor: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.1)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontWeight: 600,
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
    [theme.breakpoints.up("md")]: {
      width: "40ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

interface HeaderProps {
  title?: string;
  onSearchChange?: (_value: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
  drawerWidth?: number;
}

const Header: React.FC<HeaderProps> = ({
  title = "Application",
  onSearchChange,
  onNotificationClick,
  onProfileClick,
  notificationCount = 0,
  userAvatar,
  userName,
  drawerWidth = 240,
}) => {
  const theme = useTheme(); // Get theme from parent context

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: fontWeights.bold,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Search>
            <SearchIconWrapper>
              <Typography sx={{ fontSize: "1.2rem" }}>🔍</Typography>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={e => onSearchChange && onSearchChange(e.target.value)}
            />
          </Search>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="large"
            aria-label={`show ${notificationCount} new notifications`}
            onClick={onNotificationClick}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Typography sx={{ fontSize: "1.5rem" }}>🔔</Typography>
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={onProfileClick}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            {userAvatar ? (
              <Avatar alt={userName} src={userAvatar} sx={{ width: 32, height: 32 }} />
            ) : (
              <Typography sx={{ fontSize: "1.8rem" }}>👤</Typography>
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
