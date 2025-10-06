import {
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useGetLenders } from "../../hook/useGetLenders";
import LenderHeader from "./LenderHeader";
import LenderTable from "./LenderTable";
import LenderPagination from "./LenderPagination";
import LenderFormDialog from "./LenderFormDialog";
import LenderEditDialog from "./LenderEditDialog";
import LenderDeleteDialog from "./LenderDeleteDialog";
import type { Lender } from "../../model/Lender";

const MainLender = () => {
  const navigate = useNavigate();
  const { 
    lenders, 
    loading, 
    error, 
    totalCount,
    currentPage,
    hasNext,
    hasPrevious,
    searchTerm,
    searchLenders,
    clearFilters,
    goToPage,
    nextPage,
    previousPage,
    refetch
  } = useGetLenders();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);

  const handleEdit = useCallback((id: string) => {
    const lenderToEdit = lenders.find((lender) => lender.id === id);
    if (lenderToEdit) {
      setSelectedLender(lenderToEdit);
      setIsEditOpen(true);
    } 
  }, [lenders]);

  const handleDelete = useCallback((id: string) => {
    const lenderToDelete = lenders.find((lender) => lender.id === id);
    if (lenderToDelete) {
      setSelectedLender(lenderToDelete);
      setIsDeleteOpen(true);
    }
  }, [lenders]);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteOpen(false);
    setSelectedLender(null);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAddNew = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setSelectedLender(null);
  }, []);

  const handleFormSuccess = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleEditSuccess = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchLenders(searchTerm);
    },
    [searchLenders]
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
          <LenderHeader
            onBack={handleBackToUsers}
            onAddNew={handleAddNew}
            onSearch={handleSearch}
            onClearSearch={handleClearFilters}
            totalCount={totalCount}
            currentPage={currentPage}
            showingCount={lenders.length}
            searchTerm={searchTerm}
          />
        </Box>
        
        <Box sx={{
          overflow: "auto",
          minHeight: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <LenderTable
            lenders={lenders}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <LenderPagination
            currentPage={currentPage}
            totalCount={totalCount}
            showingCount={lenders.length}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            loading={loading}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
          />
        </Box>
        
        <LenderFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
        
        <LenderEditDialog
          open={isEditOpen}
          lender={selectedLender}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      </Box>
      {/* Delete Dialog */}
      <LenderDeleteDialog
        open={isDeleteOpen}
        onClose={handleCloseDeleteDialog}
        lender={selectedLender}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
};

export default MainLender;