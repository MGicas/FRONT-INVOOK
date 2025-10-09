import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import LoanTable from "./LoanTable";
import LoanDetailDialog from "./LoanDetailDialog";
import CreateLoanDialog from "./CreateLoanDialog";
import AddHardwareDialog from "./AddHardwareDialog";
import ReturnHardwareDialog from "./ReturnHardwareDialog";
import CloseLoanDialog from "./CloseLoanDialog";
import LoanHeader from "./LoanHeader";
import { useGetLoanData } from "../../hook/useGetLoanData";
import { useResourceNavigation } from "../../hook/useResourceNavigation";
import type { Loan } from "../../model/Loan";

const MainLoan = () => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addHardwareDialogOpen, setAddHardwareDialogOpen] = useState(false);
  const [returnHardwareDialogOpen, setReturnHardwareDialogOpen] = useState(false);
  const [closeLoanDialogOpen, setCloseLoanDialogOpen] = useState(false);
  const { navigateToMain } = useResourceNavigation();

  const { 
    data: loans, 
    loading, 
    error, 
    searchTerm, 
    totalCount,
    refetch, 
    searchLoans, 
    clearSearch 
  } = useGetLoanData();

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch(); 
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleAddHardware = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setAddHardwareDialogOpen(true);
  };

  const handleCloseAddHardwareDialog = () => {
    setAddHardwareDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleReturnHardware = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setReturnHardwareDialogOpen(true);
  };

  const handleCloseReturnHardwareDialog = () => {
    setReturnHardwareDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleCloseLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setCloseLoanDialogOpen(true);
  };

  const handleCloseCloseLoanDialog = () => {
    setCloseLoanDialogOpen(false);
    setSelectedLoan(null);
  };

  const handleActionSuccess = () => {
    refetch();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box>
        <LoanHeader
          onBack={navigateToMain}
          onAddNew={handleAddNew}
          onSearch={searchLoans}
          onClearSearch={clearSearch}
          onRefresh={refetch}
          totalCount={totalCount}
          showingCount={loans.length}
          searchTerm={searchTerm}
          loading={loading}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper
          sx={{
            borderRadius: '0 0 8px 8px',
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LoanTable
            loans={loans || []}
            loading={loading}
            error={error}
            onViewDetails={handleViewDetails}
            onAddHardware={handleAddHardware}
            onReturnHardware={handleReturnHardware}
            onCloseLoan={handleCloseLoan}
          />
        </Paper>
        <LoanDetailDialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          loan={selectedLoan}
          onAddHardware={handleAddHardware}
          onReturnHardware={handleReturnHardware}
          onCloseLoan={handleCloseLoan}
        />

        <CreateLoanDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          onSuccess={handleCreateSuccess}
        />
        <AddHardwareDialog
          open={addHardwareDialogOpen}
          onClose={handleCloseAddHardwareDialog}
          onSuccess={handleActionSuccess}
          loan={selectedLoan}
        />

        <ReturnHardwareDialog
          open={returnHardwareDialogOpen}
          onClose={handleCloseReturnHardwareDialog}
          onSuccess={handleActionSuccess}
          loan={selectedLoan}
        />

        <CloseLoanDialog
          open={closeLoanDialogOpen}
          onClose={handleCloseCloseLoanDialog}
          onSuccess={handleActionSuccess}
          loan={selectedLoan}
        />
      </Box>
    </Container>
  );
};

export default MainLoan;