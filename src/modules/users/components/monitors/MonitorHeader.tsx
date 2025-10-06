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
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
import { useDebounce } from '../../../inventory/hooks/common/useDebounce';
import { usePermissions } from '../../hook/usePermissions';

interface MonitorHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onSearch: (searchTerm: string) => void;
  onClearSearch: () => void;
  onLoadAll?: () => void;
  totalCount: number;
  currentPage: number;
  showingCount: number;
}

export const MonitorHeader = ({ 
  onBack, 
  onAddNew, 
  onSearch, 
  onClearSearch,
  onLoadAll,
  totalCount,
  currentPage,
  showingCount 
}: MonitorHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { debounce } = useDebounce();
  const { canCreateMonitor } = usePermissions();

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
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Gestión de Monitores
            </Typography>
          </Box>
        </Box>
        {canCreateMonitor && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Monitor
          </Button>
        )}
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
          Lista de Monitores ({showingCount} de {totalCount} - Página {currentPage})
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onLoadAll && totalCount > showingCount && (
            <Button
              variant="outlined"
              size="small"
              onClick={onLoadAll}
              sx={{ mr: 1 }}
            >
              Cargar Todos
            </Button>
          )}
          <TextField
            size="small"
            placeholder="Buscar por nombre..."
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

export default MonitorHeader;