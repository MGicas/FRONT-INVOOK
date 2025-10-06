import {
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useGetSupplies } from "../../hooks/supply/useGetSupplies";
import SupplyHeader from "./SupplyHeader";
import SupplyTable from "./SupplyTable";
import SupplyFormDialog from "./SupplyFormDialog";
import SupplyEditDialog from "./SupplyEditDialog";
import SupplyDeleteDialog from "./SupplyDeleteDialog";
import SupplyRestockDialog from "./SupplyRestockDialog";
import type { Supply } from "../../model/Supply";

const MainSupply = () => {
  const navigate = useNavigate();
  const { 
    supplies, 
    loading, 
    error, 
    searchSupplies, 
    clearFilters,
    refetch 
  } = useGetSupplies();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);

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

  const handleDelete = useCallback(
    (code: string) => {
      const supplyToDelete = supplies.find((supply) => supply.code === code);
      if (supplyToDelete) {
        setSelectedSupply(supplyToDelete);
        setIsDeleteOpen(true);
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
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setSelectedSupply(null);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeleteOpen(false);
    setSelectedSupply(null);
  }, []);

  const handleRestockClose = useCallback(() => {
    setIsRestockOpen(false);
    setSelectedSupply(null);
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
          <SupplyHeader
            onBack={handleBackToInventory}
            onAddNew={handleAddNew}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
            totalCount={supplies.length}
          />
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
          <SupplyTable
            supplies={supplies}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestock={handleRestock}
          />
        </Box>
        <SupplyFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
        <SupplyEditDialog
          open={isEditOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          supply={selectedSupply}
        />
        <SupplyDeleteDialog
          open={isDeleteOpen}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
          supply={selectedSupply}
        />
        <SupplyRestockDialog
          open={isRestockOpen}
          onClose={handleRestockClose}
          onSuccess={handleRestockSuccess}
          supply={selectedSupply}
        />
      </Box>
    </Container>
  );
};

export default MainSupply;
