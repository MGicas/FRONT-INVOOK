import {
  Box,
  Container,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useGetSupplies } from "../../hooks/supply/useGetSupplies";
import SupplyHeader from "./SupplyHeader";
import SupplyTable from "./SupplyTable";
import SupplyFormDialog from "./SupplyFormDialog";
import SupplyEditDialog from "./SupplyEditDialog";
import SupplyRestockDialog from "./SupplyRestockDialog";
import type { Supply } from "../../model/Supply";
import { useGetSupplyTypes } from '../../hooks/supplyType/useGetSupplyTypes';
import { SupplyTypeFormDialog } from './SupplyTypeFormDialog';


const MainSupply = () => {
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [globalIsError, setGlobalError] = useState<boolean>(false);

  const handleGlobalSuccess = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(false);
    refetch();
  };

  const handleGlobalError = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(true);
  };

  const { 
    types: supplyTypes = [], 
    loading: loadingTypes,
    refetch: refetchTypes 
  } = useGetSupplyTypes();

  const { 
    supplies, 
    loading, 
    error, 
    searchSupplies, 
    clearFilters,
    refetch 
  } = useGetSupplies();
  
  const handleAddNewType = useCallback(() => {
    setIsTypeFormOpen(true);
  }, []);

  const handleTypeFormClose = useCallback(() => {
    setIsTypeFormOpen(false);
  }, []);

  const handleTypeFormSuccess = useCallback(() => {
    void refetchTypes();
    // Aquí podrías mostrar un mensaje de éxito
  }, [refetchTypes]);

  const handleEdit = useCallback(
    (code: string) => {
      const supplyToEdit = supplies.find((supply) => supply.code === code);
      if (supplyToEdit) {
        setSelectedSupply(supplyToEdit);
        setIsEditOpen(true);
      } else {
        console.error("Suministro no encontrado:", code);
      }
    },
    [supplies]
  );

  const handleRestock = useCallback(
    (code: string) => {
      const supplyToRestock = supplies.find((supply) => supply.code === code);
      if (supplyToRestock) {
        setSelectedSupply(supplyToRestock);
        setIsRestockOpen(true);
      } else {
        console.error("Suministro no encontrado:", code);
      }
    },
    [supplies]
  );

  const handleAddNew = useCallback(() => {
    setSelectedSupply(null);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setSelectedSupply(null);
  }, []);

  const handleRestockClose = useCallback(() => {
    setIsRestockOpen(false);
    setSelectedSupply(null);
  }, []);

  const handleRestockSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchSupplies(searchTerm);
    },
    [searchSupplies]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleBackToInventory = useCallback(() => {
    navigate("/inventory");
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
        </Box>
        <Box
          sx={{
            maxHeight: "600px",
            overflow: "auto",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            width: "100%",
          }}
        >
          <SupplyHeader 
            onAddNew={handleAddNew}
            onAddNewType={handleAddNewType}
            onBack={handleBackToInventory}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
            totalCount={supplies.length}
      />

          {globalMessage && (
            <Alert
            severity={globalIsError ? "error" : "success"}
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
          <SupplyTable
            supplies={supplies}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onRestock={handleRestock}
          />
          </Box>
          <SupplyFormDialog
            open={isFormOpen}
            onClose={handleFormClose}
            onSuccess={handleGlobalSuccess}
            onError={handleGlobalError}
            supplyTypes={supplyTypes}
            loadingTypes={loadingTypes}
          />
          <SupplyEditDialog
            open={isEditOpen}
            onClose={handleEditClose}
            onSuccess={handleGlobalSuccess}
            onError={handleGlobalError}
            supply={selectedSupply}
          />

          <SupplyTypeFormDialog
            open={isTypeFormOpen}
            onClose={handleTypeFormClose}
            onSuccess={handleTypeFormSuccess}
          />
          <SupplyRestockDialog
            open={isRestockOpen}
            onClose={handleRestockClose}
            onSuccess={handleGlobalSuccess}
            onError={handleGlobalError}
            supply={selectedSupply}
        />
      </Box>
    </Container>
  );
};

export default MainSupply;
