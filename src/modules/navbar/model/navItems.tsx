import { Assignment, Home, Inventory, People } from "@mui/icons-material";
import type { NavItem } from "./Navbar";

export const getNavItems = (): NavItem[] => [
  {
    label: "Inicio",
    path: "/home",
    icon: <Home />
  },
  {
    label: "Inventario", 
    path: "/inventory",
    icon: <Inventory />
  },
  {
    label: "Usuarios",
    path: "/users", 
    icon: <People />
  },
  {
    label: "Recursos",
    path: "/resources",
    icon: <Assignment />
  }
];