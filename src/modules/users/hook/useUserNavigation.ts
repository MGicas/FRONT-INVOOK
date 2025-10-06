import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { USER_ROUTES, UserOptionsUtils } from '../model';

export const useUserNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToMain = useCallback(() => {
    navigate(USER_ROUTES.MAIN);
  }, [navigate]);

  const navigateToMonitors = useCallback(() => {
    navigate(USER_ROUTES.MONITORS);
  }, [navigate]);

  const navigateToUsers = useCallback(() => {
    navigate(USER_ROUTES.USERS);
  }, [navigate]);

  const navigateToMonitorDetail = useCallback((id: string) => {
    navigate(USER_ROUTES.MONITOR_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToUserDetail = useCallback((id: string) => {
    navigate(USER_ROUTES.USER_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToNewMonitor = useCallback(() => {
    navigate(USER_ROUTES.MONITOR_NEW);
  }, [navigate]);

  const navigateToNewUser = useCallback(() => {
    navigate(USER_ROUTES.USER_NEW);
  }, [navigate]);

  const navigateToReports = useCallback(() => {
    navigate(USER_ROUTES.REPORTS);
  }, [navigate]);

  const navigateToRoute = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const currentPath = location.pathname;
  
  const isInUserModule = useMemo(() => {
    return currentPath.startsWith(USER_ROUTES.MAIN);
  }, [currentPath]);

  const currentSection = useMemo(() => {
    if (currentPath.startsWith(USER_ROUTES.MONITORS)) return 'monitors';
    if (currentPath.startsWith(USER_ROUTES.USERS)) return 'users';
    if (currentPath === USER_ROUTES.MAIN) return 'main';
    return null;
  }, [currentPath]);

  const currentPageTitle = useMemo(() => {
    return UserOptionsUtils.getTitleByRoute(currentPath);
  }, [currentPath]);

  const isMainPage = currentPath === USER_ROUTES.MAIN;
  const isMonitorSection = currentPath.startsWith(USER_ROUTES.MONITORS);
  const isUserSection = currentPath.startsWith(USER_ROUTES.USERS);
  const isDetailPage = currentPath.includes('/:') || /\/[^/]+$/.test(currentPath);
  const isNewItemPage = currentPath.endsWith('/nuevo');

  return {
    navigateToMain,
    navigateToMonitors,
    navigateToUsers,
    navigateToMonitorDetail,
    navigateToUserDetail,
    navigateToNewMonitor,
    navigateToNewUser,
    navigateToReports,
    navigateToRoute,
    currentPath,
    currentSection,
    currentPageTitle,
    isInUserModule,
    isMainPage,
    isMonitorSection,
    isUserSection,
    isDetailPage,
    isNewItemPage,
    routes: USER_ROUTES,
  };
};