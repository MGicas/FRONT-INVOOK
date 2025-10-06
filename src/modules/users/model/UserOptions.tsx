import React from 'react';
import { Person, Monitor } from '@mui/icons-material';
import type { Theme } from '@mui/material/styles';

export interface UserOption {
  title: string;
  description: string;
  icon: (theme: Theme) => React.ReactElement;
  route: string;
  color?: string;
  examples?: string[];
  category: 'monitors' | 'lenders';
}

export const getUserOptions = (): UserOption[] => [
  {
    title: 'Monitores',
    description: 'Gestión de monitores y supervisores',
    icon: (theme: Theme) => (
      <Monitor
        sx={{ fontSize: 60, color: theme.palette.primary.main }}
      />
    ),
    route: '/users/monitors',
    category: 'monitors',
  },
  {
    title: 'Prestamistas',
    description: 'Gestión de usuarios del sistema',
    icon: (theme: Theme) => (
      <Person
        sx={{ fontSize: 60, color: theme.palette.secondary.main }}
      />
    ),
    route: '/users/prestamistas', 
    category: 'lenders',
  },
];

export const UserOptionsUtils = {
  getByCategory: (category: 'monitors' | 'lenders'): UserOption | undefined => {
    return getUserOptions().find(option => option.category === category);
  },

  getAllRoutes: (): string[] => {
    return getUserOptions().map(option => option.route);
  },

  getByRoute: (route: string): UserOption | undefined => {
    return getUserOptions().find(option => option.route === route);
  },

  getTitleByRoute: (route: string): string => {
    const option = UserOptionsUtils.getByRoute(route);
    return option ? option.title : 'Usuarios';
  },
};