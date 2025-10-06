import {
  Box,
  Typography,
  Button,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useDebounce } from "../../hooks/common/useDebounce";

interface SupplyHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onSearch: (searchTerm: string) => void;
  onClearFilters: () => void;
  totalCount: number;
}

export const SupplyHeader = ({
  onBack,
  onAddNew,
  onSearch,
  onClearFilters,
  totalCount,
}: SupplyHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { debounce } = useDebounce();

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      debounce(() => {
        if (value.trim()) {
          onSearch(value);
        } else {
          onClearFilters();
        }
      }, 500);
    },
    [onSearch, onClearFilters, debounce]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    onClearFilters();
  }, [onClearFilters]);

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
          >
            Volver
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              Gestión de Suministros
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{ borderRadius: 2 }}
        >
          Nuevo Suministro
        </Button>
      </Box>

      <Toolbar
        sx={{
          bgcolor: "grey.50",
          borderRadius: "8px 8px 0 0",
          mb: 0,
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "medium", color: "#000" }}
        >
          Lista de Suministros ({totalCount})
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "& input": {
                  color: "#000",
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ color: "grey.500" }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Toolbar>
    </>
  );
};

export default SupplyHeader;
