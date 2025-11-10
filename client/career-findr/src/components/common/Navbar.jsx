import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Settings,
  ExitToApp,
  Bookmark,
  Message,
  CalendarToday,
  WorkOutline,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, isStudent, isInstitute, isCompany, isAdmin } =
    useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (isStudent) return "/dashboard/student";
    if (isInstitute) return "/dashboard/institute";
    if (isCompany) return "/dashboard/company";
    if (isAdmin) return "/dashboard/admin";
    return "/";
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6" fontWeight={700}>
          Career Findr
        </Typography>
      </Box>
      <List>
        {user && (
          <>
            <ListItem button onClick={() => navigate(getDashboardPath())}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate("/settings")}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          {isMobile && user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() =>
              user ? navigate(getDashboardPath()) : navigate("/")
            }
          >
            <WorkOutline sx={{ color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Career Findr
            </Typography>
            {user && (
              <Chip
                label={user.role}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  display: { xs: "none", sm: "flex" },
                }}
              />
            )}
          </Box>

          <Box flexGrow={1} />

          {!isMobile && user && (
            <Box display="flex" gap={1} alignItems="center" mr={2}>
              <Button onClick={() => navigate(getDashboardPath())}>
                Dashboard
              </Button>
            </Box>
          )}

          {user ? (
            <>
              <NotificationCenter />
              <Tooltip title="Saved Items">
                <IconButton
                  onClick={() => navigate("/saved")}
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <Bookmark />
                </IconButton>
              </Tooltip>
              <Tooltip title="Messages">
                <IconButton
                  onClick={() => navigate("/messages")}
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <Message />
                </IconButton>
              </Tooltip>
              <Tooltip title="Calendar">
                <IconButton
                  onClick={() => navigate("/calendar")}
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <CalendarToday />
                </IconButton>
              </Tooltip>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, display: { xs: "none", md: "block" } }}
              />
              <IconButton onClick={handleMenuOpen} size="large">
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 36,
                    height: 36,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                    "& .MuiMenuItem-root": {
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color="primary"
                    sx={{ mt: 0.5, textTransform: "capitalize" }}
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(getDashboardPath());
                  }}
                >
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/settings");
                  }}
                >
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} sx={{ mr: 1 }}>
                Sign In
              </Button>
              <Button variant="contained" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}
