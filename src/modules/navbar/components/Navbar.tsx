import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import {
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { clearAuth } from "../../../shared/utils/ClientData";
import { NavbarActions } from "./NavbarActions";
import { getNavItems } from "../model/navItems";
import invookLogo from "../../../assets/INVOOK.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  
  const navItems = getNavItems();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: '#2e7d32',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ height: 80 }}>
            <Box
              component={Link}
              to="/home"
              sx={{
                flexGrow: isMobile ? 1 : 0,
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img 
                src={invookLogo} 
                alt="INVOOK Logo" 
                style={{
                  height: '50px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? '#ffeb3b' : 'white',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 235, 59, 0.1)',
                        color: '#ffeb3b',
                      },
                      ...(location.pathname === item.path && {
                        backgroundColor: 'rgba(255, 235, 59, 0.1)',
                      }),
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
            {!isMobile && (
              <Button
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    color: '#f44336',
                  },
                }}
              >
                Cerrar sesión
              </Button>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ color: '#ffeb3b' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
          },
        }}
      >
        <NavbarActions 
          handleDrawerToggle={handleDrawerToggle}
          handleLogout={handleLogout}
        />
      </Drawer>
    </>
  );
}