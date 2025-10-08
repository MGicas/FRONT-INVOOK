import { Box, Typography, Button, Toolbar, TextField, InputAdornment, IconButton } from '@mui/material';
import { Assignment as AssignmentIcon, Add as AddIcon, ArrowBack as ArrowBackIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useCallback, useState } from 'react';

interface LoansHeaderProps {
  onBack: () => void;
  onAddNew: () => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  totalCount: number;
}

const LoansHeader = ({ onBack, onAddNew, onSearch, onClearSearch, totalCount }: LoansHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      onSearch(value);
    } else {
      onClearSearch();
    }
  }, [onSearch, onClearSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    onClearSearch();
  }, [onClearSearch]);

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ borderRadius: 2 }}>
            Volver
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#000' }}>
              Gestión de Préstamos
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddNew} sx={{ borderRadius: 2 }}>
          Nuevo Préstamo
        </Button>
      </Box>

      <Toolbar sx={{ bgcolor: 'grey.50', borderRadius: '8px 8px 0 0', mb: 0, display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: '#000' }}>
          Lista de Préstamos ({totalCount})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar por responsable, recurso o estado..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { backgroundColor: 'white', '& input': { color: '#000' } } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} sx={{ color: 'grey.500' }}>
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

export default LoansHeader;
