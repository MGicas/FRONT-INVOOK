import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { RESOURCE_ROUTES, ResourceOptionsUtils } from '../model';

export const useResourceNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToMain = useCallback(() => {
    navigate(RESOURCE_ROUTES.MAIN);
  }, [navigate]);

  const navigateToConsum = useCallback(() => {
    navigate(RESOURCE_ROUTES.CONSUM);
  }, [navigate]);

  const navigateToLoan = useCallback(() => {
    navigate(RESOURCE_ROUTES.LOAN);
  }, [navigate]);

  const navigateToConsumDetail = useCallback((id: string) => {
    navigate(RESOURCE_ROUTES.CONSUM_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToLoanDetail = useCallback((id: string) => {
    navigate(RESOURCE_ROUTES.LOAN_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToNewConsum = useCallback(() => {
    navigate(RESOURCE_ROUTES.CONSUM_NEW);
  }, [navigate]);

  const navigateToNewLoan = useCallback(() => {
    navigate(RESOURCE_ROUTES.LOAN_NEW);
  }, [navigate]);

  const navigateToReports = useCallback(() => {
    navigate(RESOURCE_ROUTES.REPORTS);
  }, [navigate]);

  const navigateToRoute = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const currentPath = location.pathname;
  
  const isInResourceModule = useMemo(() => {
    return currentPath.startsWith(RESOURCE_ROUTES.MAIN);
  }, [currentPath]);

  const currentSection = useMemo(() => {
    if (currentPath.startsWith(RESOURCE_ROUTES.CONSUM)) return 'consum';
    if (currentPath.startsWith(RESOURCE_ROUTES.LOAN)) return 'loan';
    if (currentPath === RESOURCE_ROUTES.MAIN) return 'main';
    return null;
  }, [currentPath]);

  const currentPageTitle = useMemo(() => {
    return ResourceOptionsUtils.getTitleByRoute(currentPath);
  }, [currentPath]);

  const isMainPage = currentPath === RESOURCE_ROUTES.MAIN;
  const isConsumSection = currentPath.startsWith(RESOURCE_ROUTES.CONSUM);
  const isLoanSection = currentPath.startsWith(RESOURCE_ROUTES.LOAN);
  const isDetailPage = currentPath.includes('/:') || /\/[^/]+$/.test(currentPath);
  const isNewItemPage = currentPath.endsWith('/nuevo');

  return {
    navigateToMain,
    navigateToConsum,
    navigateToLoan,
    navigateToConsumDetail,
    navigateToLoanDetail,
    navigateToNewConsum,
    navigateToNewLoan,
    navigateToReports,
    navigateToRoute,
    currentPath,
    currentSection,
    currentPageTitle,
    isInResourceModule,
    isMainPage,
    isConsumSection,
    isLoanSection,
    isDetailPage,
    isNewItemPage,
    routes: RESOURCE_ROUTES,
  };
};