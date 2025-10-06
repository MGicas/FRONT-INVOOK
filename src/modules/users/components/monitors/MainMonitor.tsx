import {
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useGetMonitors } from "../../hook/useGetMonitors";
import { usePermissions } from "../../hook/usePermissions";
import MonitorHeader from "./MonitorHeader";
import MonitorTable from "./MonitorTable";
import MonitorFormDialog from "./MonitorFormDialog";
import MonitorEditDialog from "./MonitorEditDialog";
import MonitorDeleteDialog from "./MonitorDeleteDialog";
import MonitorPagination from "./MonitorPagination";
import type { Monitor } from "../../model/Monitor";

const MainMonitor = () => {
  const navigate = useNavigate();
  const { canEditMonitor, canDeleteMonitor } = usePermissions();
  const { 
    monitors, 
    loading, 
    error, 
    totalCount,
    currentPage,
    hasNext,
    hasPrevious,
    searchMonitors, 
    clearFilters,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    loadAllPages
  } = useGetMonitors();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);

  const handleEdit = useCallback(
    (id: number) => {
      if (!canEditMonitor) return;
      
      const monitorToEdit = monitors.find((monitor) => monitor.id === id);
      if (monitorToEdit) {
        setSelectedMonitor(monitorToEdit);
        setIsEditOpen(true);
      } else {
        console.error("Monitor no encontrado:", id);
      }
    },
    [monitors, canEditMonitor]
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (!canDeleteMonitor) return;
      
      const monitorToDelete = monitors.find((monitor) => monitor.id === id);
      if (monitorToDelete) {
        setSelectedMonitor(monitorToDelete);
        setIsDeleteOpen(true);
      } else {
        console.error("Monitor no encontrado:", id);
      }
    },
    [monitors, canDeleteMonitor]
  );

  const handleAddNew = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setSelectedMonitor(null);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeleteOpen(false);
    setSelectedMonitor(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeleteSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchMonitors(searchTerm);
    },
    [searchMonitors]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleBackToUsers = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1600px", mx: "auto" }}>
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "background.default",
            pb: 2,
            mb: 2,
          }}
        >
          <MonitorHeader
            onBack={handleBackToUsers}
            onAddNew={handleAddNew}
            onSearch={handleSearch}
            onClearSearch={handleClearFilters}
            onLoadAll={loadAllPages}
            totalCount={totalCount}
            currentPage={currentPage}
            showingCount={monitors.length}
          />
        </Box>
        <Box sx={{
          overflow: "auto",
          minHeight: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <MonitorTable
            monitors={monitors}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <MonitorPagination
            currentPage={currentPage}
            totalCount={totalCount}
            showingCount={monitors.length}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            loading={loading}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
          />
        </Box>
        
        <MonitorFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
        
        <MonitorEditDialog
          open={isEditOpen}
          monitor={selectedMonitor}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
        
        <MonitorDeleteDialog
          open={isDeleteOpen}
          monitor={selectedMonitor}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
        />
      </Box>
    </Container>
  );
};

export default MainMonitor;