import type { User } from '../../shared/domain/Auth';

export interface RouteConfig {
  [role: string]: string;
}

export class NavigationService {
  private static readonly DEFAULT_ROUTE = '/home';

  static getRouteForUser(user: User): string {
    if (!user?.role) {
      return this.DEFAULT_ROUTE;
    }
    const role = user.role.toLowerCase();
    if (role === 'admin' || role === 'monitor') {
      return '/home';
    }

    return this.DEFAULT_ROUTE;
  }

  static canAccessRoute(user: User, route: string): boolean {
    if (!user?.role) {
      return false;
    }

    const role = user.role.toLowerCase();
    
    if (role !== 'admin' && role !== 'monitor') {
      return false;
    }

    const allowedRoutes = [
      '/home',
      '/inventory',
      '/users', 
      '/resources'
    ];

    return allowedRoutes.some(allowedRoute => 
      route.startsWith(allowedRoute) || route === '/'
    );
  }

  static getAvailableRoutes(user: User): Array<{path: string, label: string}> {
    if (!user?.role) {
      return [{ path: '/home', label: 'Inicio' }];
    }

    const role = user.role.toLowerCase();
    if (role !== 'admin' && role !== 'monitor') {
      return [{ path: '/home', label: 'Inicio' }];
    }
    return [
      { path: '/home', label: 'Inicio' },
      { path: '/inventory', label: 'Inventario' },
      { path: '/users', label: 'Usuarios' },
      { path: '/resources', label: 'Recursos' },
    ];
  }
  static isAuthorizedRole(user: User): boolean {
    if (!user?.role) {
      return false;
    }

    const role = user.role.toLowerCase();
    return role === 'admin' || role === 'monitor';
  }
}