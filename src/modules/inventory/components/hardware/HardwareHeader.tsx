import {
  Box,
  Typography,
  Button,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
import { useDebounce } from '../../hooks/common/useDebounce';

interface HardwareHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onAddNewType: () => void;
  onSearch: (searchTerm: string) => void;
  onClearSearch: () => void;
  totalCount: number;
}

export const HardwareHeader = ({ onBack, onAddNew, onAddNewType, onSearch, onClearSearch, totalCount }: HardwareHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { debounce } = useDebounce();

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
            <ComputerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Gestión de Equipos
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddNewType}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Tipo
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Equipo
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
          Lista de Equipos ({totalCount})
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar por tipo de equipo..."
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
        </Box>
      </Toolbar>
    </>
  );
};

export default HardwareHeader;