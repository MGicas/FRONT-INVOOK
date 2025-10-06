import React from 'react';
import { Computer, Storage } from '@mui/icons-material';
import type { Theme } from '@mui/material/styles';

export interface InventoryOption {
  title: string;
  description: string;
  icon: (theme: Theme) => React.ReactElement;
  route: string;
  color: string;
  examples: string[];
  category: 'equipment' | 'supplies';
}

export const getInventoryOptions = (): InventoryOption[] => [
  {
    title: 'Equipos',
    description: 'Gestión del hardware',
    icon: (theme: Theme) => (
      <Computer
        sx={{ fontSize: 60, color: theme.palette.primary.main }}
      />
    ),
    route: '/inventory/equipos',
    color: '#388e3c',
    examples: [
      'Routers',
      'Testers',
      'Ponchadoras'
    ],
    category: 'equipment',
  },
  {
    title: 'Suministros',
    description: 'Gestión de consumibles y suministros',
    icon: (theme: Theme) => (
      <Storage
        sx={{ fontSize: 60, color: theme.palette.secondary.main }}
      />
    ),
    route: '/inventory/consumibles',
    color: '#388e3c',
    examples: [
      'Resistencias',
      'Compuertas',
      'Jumpers',
    ],
    category: 'supplies',
  },
];

export const InventoryOptionsUtils = {
  getByCategory: (category: 'equipment' | 'supplies'): InventoryOption | undefined => {
    return getInventoryOptions().find(option => option.category === category);
  },

  getAllRoutes: (): string[] => {
    return getInventoryOptions().map(option => option.route);
  },

  getByRoute: (route: string): InventoryOption | undefined => {
    return getInventoryOptions().find(option => option.route === route);
  },

  getTitleByRoute: (route: string): string => {
    const option = InventoryOptionsUtils.getByRoute(route);
    return option ? option.title : 'Inventario';
  },
};