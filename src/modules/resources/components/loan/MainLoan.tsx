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

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState(false);
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

  const handleGlobalSuccess = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(false);
    refetch();
  };

  const handleGlobalError = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(true);
  };

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

  const handleAddHardware = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setAddHardwareDialogOpen(true);
  };

  const handleReturnHardware = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setReturnHardwareDialogOpen(true);
  };

  const handleCloseLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailDialogOpen(false);
    setCloseLoanDialogOpen(true);
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

        {globalMessage && (
          <Alert
            severity={globalError ? "error" : "success"}
            sx={{ mb: 2 }}
            onClose={() => setGlobalMessage(null)}
          >
            {globalMessage}
          </Alert>
        )}

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
          open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onSuccess={handleGlobalSuccess} onError={handleGlobalError} />
        
        <AddHardwareDialog
          open={addHardwareDialogOpen} onClose={() => setAddHardwareDialogOpen(false)} onSuccess={handleGlobalSuccess} onError={handleGlobalError} loan={selectedLoan} />

        <ReturnHardwareDialog
          open={returnHardwareDialogOpen} onClose={() => setReturnHardwareDialogOpen(false)} onSuccess={handleGlobalSuccess} onError={handleGlobalError} loan={selectedLoan} />

        <CloseLoanDialog
          open={closeLoanDialogOpen} onClose={() => setCloseLoanDialogOpen(false)} onSuccess={handleGlobalSuccess} onError={handleGlobalError} loan={selectedLoan}
        />
      </Box>
    </Container>
  );
};

export default MainLoan;