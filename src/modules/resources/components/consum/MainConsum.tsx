import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { ConsumTable } from "./ConsumTable";
import { ConsumDetailDialog } from "./ConsumDetailDialog";
import { ConsumCreateDialog } from "./ConsumCreateDialog";
import ConsumHeader from "./ConsumHeader";
import { useGetConsumData } from "../../hook/useGetConsumData";
import { useResourceNavigation } from "../../hook/useResourceNavigation";
import type { Consum } from "../../model/Consum";

const MainConsum = () => {
  const [selectedConsum, setSelectedConsum] = useState<Consum | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { navigateToMain } = useResourceNavigation();

  // Usar el hook para obtener los datos
  const { 
    data: consums, 
    loading, 
    error, 
    searchTerm, 
    totalCount,
    refetch, 
    searchConsums, 
    clearSearch 
  } = useGetConsumData();

  const handleViewDetails = (consum: Consum) => {
    setSelectedConsum(consum);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedConsum(null);
  };

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch(); // Recargar los datos después de crear
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box>
        {/* Header with search */}
        <ConsumHeader
          onBack={navigateToMain}
          onAddNew={handleAddNew}
          onSearch={searchConsums}
          onClearSearch={clearSearch}
          onRefresh={refetch}
          totalCount={totalCount}
          showingCount={consums.length}
          searchTerm={searchTerm}
          loading={loading}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table */}
        <Paper
          sx={{
            borderRadius: '0 0 8px 8px',
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ConsumTable
            consums={consums || []}
            loading={loading}
            error={error}
            onViewDetails={handleViewDetails}
          />
        </Paper>

        {/* Detail Dialog */}
        <ConsumDetailDialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          consum={selectedConsum}
        />

        {/* Create Dialog */}
        <ConsumCreateDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          onSuccess={handleCreateSuccess}
        />
      </Box>
    </Container>
  );
};

export default MainConsum;