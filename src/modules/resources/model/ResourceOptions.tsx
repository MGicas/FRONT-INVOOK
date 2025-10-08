import React from 'react';
import { Assignment, Inventory2 } from '@mui/icons-material';
import type { Theme } from '@mui/material/styles';

export interface ResourceOption {
  title: string;
  description: string;
  icon: (theme: Theme) => React.ReactElement;
  route: string;
  color: string;
  category: 'loans' | 'one_time_items';
}

export const getResourceOptions = (): ResourceOption[] => [
  {
    title: 'Préstamos',
    description: 'Gestiona préstamos de recursos, fechas de entrega y devolución, y seguimiento de responsables.',
    icon: (theme: Theme) => (
      <Assignment sx={{ fontSize: 60, color: theme.palette.primary.main }} />
    ),
    route: '/resources/prestamos',
    color: '#388e3c',
    category: 'loans',
  },
  {
    title: 'Artículos de entrega única',
    description: 'Administra artículos que se entregan una sola vez. Control de stock y registro de entregas.',
    icon: (theme: Theme) => (
      <Inventory2 sx={{ fontSize: 60, color: theme.palette.secondary.main }} />
    ),
    route: '/resources/entrega-unica',
    color: '#388e3c',
    category: 'one_time_items',
  },
];

export const ResourceOptionsUtils = {
  getByCategory: (category: 'loans' | 'one_time_items'): ResourceOption | undefined => {
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
