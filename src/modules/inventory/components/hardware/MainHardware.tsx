import { Box, Container, Alert  } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useGetHardware } from "../../hooks/hardware/useGetHardware";
import { HardwareHeader } from "./HardwareHeader";
import { HardwareTable } from "./HardwareTable";
import { HardwareFormDialog } from "./HardwareFormDialog";
import HardwareEditDialog from "./HardwareEditDialog";
import HardwareDeactivateDialog from "./HardwareDeactivateDialog";
import type { Hardware } from "../../model/Hardware";
import HardwareTypeFormDialog from "./HardwareTypeFormDialog";
import { useGetHardwareTypes } from '../../hooks/hardwareType/useGetHardwareTypes';

const HardwarePage = () => {
  const navigate = useNavigate();
  const { hardware, loading, error, searchByType, clearFilters, refetch } =
    useGetHardware();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(
    null
  );

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [globalIsError, setGlobalError] = useState<boolean>(false);

  const { refetch: refetchTypes } = useGetHardwareTypes();

  const handleGlobalSuccess = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(false);
    refetch();
  };

  const handleGlobalError = (message: string) => {
    setGlobalMessage(message);
    setGlobalError(true);
  };

  const handleEdit = useCallback(
    (serial: string) => {
      const hardwareToEdit = hardware.find((hw) => hw.serial === serial);
      if (hardwareToEdit) {
        setSelectedHardware(hardwareToEdit);
        setIsEditOpen(true);
      } 
    },
    [hardware]
  );

  const handleDelete = useCallback(
    (serial: string) => {
      const hardwareToDeactivate = hardware.find((hw) => hw.serial === serial);
      if (hardwareToDeactivate) {
        setSelectedHardware(hardwareToDeactivate);
        setIsDeactivateOpen(true);
      }
    },
    [hardware]
  );

  const handleAddNew = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleAddNewType = useCallback(() => {
    setIsTypeFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleTypeFormClose = useCallback(() => {
    setIsTypeFormOpen(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setSelectedHardware(null);
  }, []);

  const handleDeactivateClose = useCallback(() => {
    setIsDeactivateOpen(false);
    setSelectedHardware(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleTypeFormSuccess = useCallback(() => {
    refetchTypes();
  }, [refetchTypes]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchByType(searchTerm);
    },
    [searchByType]
  );

  const handleClearSearch = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleBackToInventory = useCallback(() => {
    navigate("/inventory");
  }, [navigate]);

  return (
    <Container maxWidth="lg">
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
          <HardwareHeader
            onBack={handleBackToInventory}
            onAddNew={handleAddNew}
            onAddNewType={handleAddNewType}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            totalCount={hardware.length}
          />
        </Box>
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
        <Box
          sx={{
            maxHeight: "600px",
            overflow: "auto",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
          }}
        >
          <HardwareTable
            hardware={hardware}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>

        <HardwareFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

        <HardwareTypeFormDialog
          open={isTypeFormOpen}
          onClose={handleTypeFormClose}
          onSuccess={handleTypeFormSuccess}
        />

        <HardwareEditDialog
          open={isEditOpen}
          hardware={selectedHardware}
          onClose={handleEditClose}
          onSuccess={handleGlobalSuccess}
          onError={handleGlobalError}
        />

        <HardwareDeactivateDialog
          open={isDeactivateOpen}
          hardware={selectedHardware}
          onClose={handleDeactivateClose}
          onSuccess={handleGlobalSuccess}
          onError={handleGlobalError}
        />
      </Box>
    </Container>
  );
};

export default HardwarePage;
