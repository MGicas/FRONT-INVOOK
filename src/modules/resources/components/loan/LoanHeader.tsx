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
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../../../inventory/hooks/common/useDebounce';

interface LoanHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  onRefresh: () => void;
  totalCount: number;
  showingCount: number;
  searchTerm: string;
  loading: boolean;
}

const LoanHeader = ({
  onBack,
  onAddNew,
  onSearch,
  onClearSearch,
  onRefresh,
  totalCount,
  showingCount,
  searchTerm: initialSearchTerm,
  loading,
}: LoanHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const { debounce } = useDebounce();

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debounce(() => {
      if (value.trim()) {
        onSearch(value);
      } else {
        onClearSearch();
      }
    }, 500);
  }, [onSearch, onClearSearch, debounce]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    onClearSearch();
  }, [onClearSearch]);

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
          >
            Volver
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Gestión de Préstamos
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Préstamo
          </Button>
        </Box>
      </Box>
      
      <Toolbar sx={{ 
        bgcolor: 'grey.50', 
        borderRadius: '8px 8px 0 0', 
        mb: 0, 
        display: 'flex', 
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: '#000' }}>
          Lista de Préstamos ({showingCount} de {totalCount})
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar préstamos..."
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loading}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& input': {
                  color: '#000',
                }
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ color: 'grey.500' }}
                      disabled={loading}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />
        </Box>
      </Toolbar>
    </>
  );
};

export default LoanHeader;