import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  LogoutOutlined,
  PeopleOutline,
  CloudQueue,
  LocalCafe,
  Category,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "../ThemeModeProvider";
import { useAuth } from "../contexts/AuthContext";

const AdminAppBar = ({ title = "" }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: "Usuários", icon: <PeopleOutline />, path: "/usuarios" },
    { label: "Bucket", icon: <CloudQueue />, path: "/arquivos_front" },
    { label: "Bebidas", icon: <LocalCafe />, path: "/bebidas_front" },
    { label: "Categorias", icon: <Category />, path: "/categorias_front" },
  ];

  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar position="static" sx={{ width: "100vw" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Hamburger no mobile */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo - mobile (após hamburger) */}
          <Box
            component="img"
            src="/static/logo.png"
            alt="logo"
            sx={{ height: 36, display: { xs: "flex", md: "none" }, ml: 1 }}
          />

          {/* Botões visíveis em desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Logo - desktop (antes dos menus) */}
            <Box
              component="img"
              src="/static/logo.png"
              alt="logo"
              sx={{ height: 36, display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            <Typography variant="h6" component="div" sx={{ ml: 2 }}>
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Theme toggle + Botão de sair: toggle visível sempre, sair oculto no mobile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => toggleMode()}
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button
              color="inherit"
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Box>

        {/* Drawer para mobile */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 260 }}
            role="presentation"
            onKeyDown={toggleDrawer(false)}
          >
            {/* Header de espaçamento com cor primária */}
            <Box sx={{ height: "14vh", backgroundColor: "primary.main" }} />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={async () => {
                    await handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <LogoutOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
