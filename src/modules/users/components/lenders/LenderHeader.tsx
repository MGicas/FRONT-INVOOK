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
  People as PeopleIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../../../inventory/hooks/common/useDebounce';

interface LenderHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onSearch?: (searchTerm: string) => void;
  onClearSearch?: () => void;
  totalCount: number;
  currentPage: number;
  showingCount: number;
  searchTerm?: string;
}

const LenderHeader = ({
  onBack,
  onAddNew,
  onSearch,
  onClearSearch,
  totalCount,
  currentPage,
  showingCount,
  searchTerm: initialSearchTerm = "",
}: LenderHeaderProps) => {
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
        onSearch?.(value);
      } else {
        onClearSearch?.();
      }
    }, 500);
  }, [onSearch, onClearSearch, debounce]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    onClearSearch?.();
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
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Gestión de Prestamistas
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{ borderRadius: 2 }}
        >
          Nuevo Prestamista
        </Button>
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
          Lista de Prestamistas ({showingCount} de {totalCount} - Página {currentPage})
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onSearch && (
            <TextField
              size="small"
              placeholder="Buscar prestamistas..."
              value={searchTerm}
              onChange={handleSearchChange}
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
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        </Box>
      </Toolbar>
    </>
  );
};

export default LenderHeader;