import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { INVENTORY_ROUTES, InventoryOptionsUtils } from '../model';

export const useInventoryNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToMain = useCallback(() => {
    navigate(INVENTORY_ROUTES.MAIN);
  }, [navigate]);

  const navigateToEquipment = useCallback(() => {
    navigate(INVENTORY_ROUTES.EQUIPMENT);
  }, [navigate]);

  const navigateToSupplies = useCallback(() => {
    navigate(INVENTORY_ROUTES.SUPPLIES);
  }, [navigate]);

  const navigateToEquipmentDetail = useCallback((id: string) => {
    navigate(INVENTORY_ROUTES.EQUIPMENT_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToSupplyDetail = useCallback((id: string) => {
    navigate(INVENTORY_ROUTES.SUPPLIES_DETAIL.replace(':id', id));
  }, [navigate]);

  const navigateToNewEquipment = useCallback(() => {
    navigate(INVENTORY_ROUTES.EQUIPMENT_NEW);
  }, [navigate]);

  const navigateToNewSupply = useCallback(() => {
    navigate(INVENTORY_ROUTES.SUPPLIES_NEW);
  }, [navigate]);

  const navigateToReports = useCallback(() => {
    navigate(INVENTORY_ROUTES.REPORTS);
  }, [navigate]);

  const navigateToRoute = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const currentPath = location.pathname;
  
  const isInInventoryModule = useMemo(() => {
    return currentPath.startsWith(INVENTORY_ROUTES.MAIN);
  }, [currentPath]);

  const currentSection = useMemo(() => {
    if (currentPath.startsWith(INVENTORY_ROUTES.EQUIPMENT)) return 'equipment';
    if (currentPath.startsWith(INVENTORY_ROUTES.SUPPLIES)) return 'supplies';
    if (currentPath === INVENTORY_ROUTES.MAIN) return 'main';
    return null;
  }, [currentPath]);

  const currentPageTitle = useMemo(() => {
    return InventoryOptionsUtils.getTitleByRoute(currentPath);
  }, [currentPath]);

  const isMainPage = currentPath === INVENTORY_ROUTES.MAIN;
  const isEquipmentSection = currentPath.startsWith(INVENTORY_ROUTES.EQUIPMENT);
  const isSuppliesSection = currentPath.startsWith(INVENTORY_ROUTES.SUPPLIES);
  const isDetailPage = currentPath.includes('/:') || /\/[^/]+$/.test(currentPath);
  const isNewItemPage = currentPath.endsWith('/nuevo');

  return {
    navigateToMain,
    navigateToEquipment,
    navigateToSupplies,
    navigateToEquipmentDetail,
    navigateToSupplyDetail,
    navigateToNewEquipment,
    navigateToNewSupply,
    navigateToReports,
    navigateToRoute,
    currentPath,
    currentSection,
    currentPageTitle,
    isInInventoryModule,
    isMainPage,
    isEquipmentSection,
    isSuppliesSection,
    isDetailPage,
    isNewItemPage,
    routes: INVENTORY_ROUTES,
  };
};