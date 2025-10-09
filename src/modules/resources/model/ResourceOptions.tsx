import React from 'react';
import { Inventory, Assignment } from '@mui/icons-material';
import type { Theme } from '@mui/material/styles';

export interface ResourceOption {
  title: string;
  description: string;
  icon: (theme: Theme) => React.ReactElement;
  route: string;
  color?: string;
  examples?: string[];
  category: 'consum' | 'loan';
}

export const getResourceOptions = (): ResourceOption[] => [
  {
    title: 'Consumibles',
    description: 'Gestión de recursos consumibles y materiales',
    icon: (theme: Theme) => (
      <Inventory
        sx={{ fontSize: 60, color: theme.palette.primary.main }}
      />
    ),
    route: '/resources/consumibles',
    category: 'consum',
  },
  {
    title: 'Prestamos',
    description: 'Gestión de préstamos y asignaciones',
    icon: (theme: Theme) => (
      <Assignment
        sx={{ fontSize: 60, color: theme.palette.secondary.main }}
      />
    ),
    route: '/resources/prestamos',
    category: 'loan',
  },
];

export const ResourceOptionsUtils = {
  getByCategory: (category: 'consum' | 'loan'): ResourceOption | undefined => {
    return getResourceOptions().find(option => option.category === category);
  },

  getAllRoutes: (): string[] => {
    return getResourceOptions().map(option => option.route);
  },

  getByRoute: (route: string): ResourceOption | undefined => {
    return getResourceOptions().find(option => option.route === route);
  },

  getTitleByRoute: (route: string): string => {
    const option = ResourceOptionsUtils.getByRoute(route);
    return option ? option.title : 'Recursos';
  },
};