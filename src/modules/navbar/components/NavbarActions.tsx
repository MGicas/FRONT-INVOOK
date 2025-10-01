import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Close as CloseIcon, Logout } from "@mui/icons-material";
import type { NavItem } from "../model/Navbar";
import { getNavItems } from "../model/navItems";
import invookLogo from "../../../assets/INVOOK.png";

interface NavbarActionsProps {
  handleDrawerToggle: () => void;
  handleLogout: () => void;
}

export const NavbarActions = ({ handleDrawerToggle, handleLogout }: NavbarActionsProps) => {
  const location = useLocation();
  const navItems = getNavItems();

  const logoutItem: NavItem = {
    label: "Cerrar sesión",
    path: "/login",
    icon: <Logout />,
    onClick: handleLogout
  };

  return (
    <Box sx={{ width: 280 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#2e7d32',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={invookLogo} 
            alt="INVOOK Logo" 
            style={{
              height: '35px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={handleDrawerToggle}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#2e7d32' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ color: location.pathname === item.path ? '#2e7d32' : 'inherit' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleDrawerToggle();
              handleLogout();
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f44336' }}>
              {logoutItem.icon}
            </ListItemIcon>
            <ListItemText 
              primary={logoutItem.label}
              sx={{ color: '#f44336' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default NavbarActions;