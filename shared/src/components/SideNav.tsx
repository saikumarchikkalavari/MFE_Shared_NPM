import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fontTokens, fontWeights } from "../theme";

interface NavItem {
  id?: string; // Unique identifier for selection tracking
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  children?: NavItem[];
}

interface SideNavProps {
  navItems: NavItem[];
  title?: string;
  width?: number;
  currentPath?: string; // Optional current path for highlighting active items
}

const SideNav: React.FC<SideNavProps> = ({
  navItems,
  title = "Navigation",
  width = 240,
  currentPath,
}) => {
  const theme = useTheme(); // Theme context guaranteed from parent App
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  // Selection is now derived from currentPath only

  // Effect to detect current route and highlight corresponding nav item
  // Expand parent group if currentPath matches a child
  useEffect(() => {
    if (!currentPath) return;
    navItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (child.id) {
            const separatorIndex = child.id.indexOf("::");
            if (separatorIndex > 0) {
              const groupKey = child.id.substring(0, separatorIndex);
              const routeName = child.id.substring(separatorIndex + 2);
              const expectedPath = `/${groupKey}/${routeName}`;
              if (currentPath === expectedPath) {
                setExpandedItems(prev => new Set(prev).add(item.label));
              }
            }
          }
        });
      }
    });
  }, [currentPath, navItems]);

  const handleToggle = (label: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const itemId = item.id || item.label; // Use id if available, fallback to label
    // Selection is now derived from currentPath only
    let isSelected = false;
    if (item.id) {
      // Standalone item
      isSelected = currentPath === `/${item.id}`;
    }
    if (item.id && item.id.includes("::")) {
      // Child item
      const separatorIndex = item.id.indexOf("::");
      if (separatorIndex > 0) {
        const groupKey = item.id.substring(0, separatorIndex);
        const routeName = item.id.substring(separatorIndex + 2);
        const expectedPath = `/${groupKey}/${routeName}`;
        isSelected = currentPath === expectedPath;
      }
    }
    // Debugging
    console.log("SideNav Item:", {
      label: item.label,
      itemId,
      isSelected,
      currentPath,
      hasOnClick: !!item.onClick
    });
    return (
      <React.Fragment key={item.label}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggle(item.label);
              } else if (item.onClick) {
                console.log("🖱️ Clicking:", item.label, "→", itemId);
                item.onClick();
              } else if (item.href) {
                console.log("🖱️ Clicking href:", item.label, "→", item.href);
                window.location.href = item.href;
              }
            }}
            sx={{
              pl: 2 + level * 2,
              backgroundColor: isSelected ? "secondary.main" : "transparent",
              borderLeft: isSelected ? "4px solid" : "4px solid transparent",
              borderColor: isSelected ? "info.main" : "transparent",
              "&:hover": {
                backgroundColor: isSelected ? "secondary.main" : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isSelected ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: fontTokens.sm,
                fontWeight: isSelected ? fontWeights.bold : fontWeights.normal,
                color: isSelected ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
              }}
            />
            {hasChildren && (
              <Typography
                sx={{
                  color: isSelected ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {isExpanded ? "−" : "+"}
              </Typography>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          backgroundColor: "primary.main",
          color: "text.secondary",
          borderRight: "none",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          minHeight: 64,
        }}
      >
        <Typography variant="h6" fontWeight={fontWeights.bold} color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "divider" }} />
      <List sx={{ pt: 1 }}>{navItems.map(item => renderMenuItem(item))}</List>
    </Drawer>
  );
};

export default SideNav;
