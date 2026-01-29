import React from "react";
import { Box, Breadcrumbs, Typography, Link } from "@mui/material";
import { fontTokens, fontWeights } from "../theme";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MainContentProps {
  pageTitle: string;
  subTitle?: string;
  actions?: React.ReactNode;
  headerActions?: React.ReactNode; // For breadcrumb line (like refresh time)
  children: React.ReactNode;
  showHome?: boolean;
  homeTitle?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  pageTitle,
  subTitle,
  actions,
  headerActions,
  children,
  showHome = true,
  homeTitle = "Home",
}) => {
  const breadcrumbs: BreadcrumbItem[] = showHome
    ? [{ label: homeTitle, onClick: () => (window.location.href = "/") }, { label: pageTitle }]
    : [{ label: pageTitle }];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Breadcrumbs Row with Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumbs
          separator={<Typography sx={{ color: "text.primary", fontSize: "0.9rem" }}>›</Typography>}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast) {
              return (
                <Typography
                  key={index}
                  color="primary.dark"
                  sx={{ fontSize: fontTokens.xs, fontWeight: fontWeights.bold }}
                >
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Link
                key={index}
                underline="hover"
                color="text.primary"
                href={crumb.href}
                onClick={e => {
                  if (crumb.onClick) {
                    e.preventDefault();
                    crumb.onClick();
                  }
                }}
                sx={{
                  cursor: "pointer",
                  fontSize: fontTokens.xs,
                  fontWeight: fontWeights.light,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {index === 0 && <Typography sx={{ mr: 0.5, fontSize: fontTokens.base }}>🏠</Typography>}
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>

        {/* Header Actions (like refresh time) */}
        {headerActions && <Box sx={{ display: "flex", alignItems: "center" }}>{headerActions}</Box>}
      </Box>

      {/* Page Title Row with Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={fontWeights.bold}>
            {pageTitle}
          </Typography>
          {subTitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subTitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {actions && <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>{actions}</Box>}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          p: 3,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainContent;
