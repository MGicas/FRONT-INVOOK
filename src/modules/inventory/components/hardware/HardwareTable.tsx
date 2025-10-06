import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMemo } from 'react';
import type { Hardware } from '../../model/Hardware';

interface HardwareTableProps {
  hardware: Hardware[];
  loading: boolean;
  error: string | null;
  onEdit: (serial: string) => void;
  onDelete: (serial: string) => void;
}

const getStatusColor = (estado: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (estado) {
    case 'BUENO':
      return 'success';
    case 'FUNCIONAL':
      return 'success';
    case 'DAÑO_LEVE':
      return 'warning';
    case 'NO_FUNCIONA':
      return 'error';
    case 'PERDIDO':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (estado: string) => {
  switch (estado) {
    case 'BUENO':
      return 'Bueno';
    case 'FUNCIONAL':
      return 'Funcional';
    case 'DAÑO_LEVE':
      return 'Daño Leve';
    case 'NO_FUNCIONA':
      return 'No Funciona';
    case 'PERDIDO':
      return 'Perdido';
    default:
      return estado;
  }
};

const getAvailabilityColor = (available: string): 'success' | 'error' => {
  return available === 'DISPONIBLE' ? 'success' : 'error';
};

const getAvailabilityLabel = (available: string) => {
  return available === 'DISPONIBLE' ? 'Disponible' : 'No Disponible';
};

export const HardwareTable = ({ hardware, loading, error, onEdit, onDelete }: HardwareTableProps) => {
  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: '#000' }}>
              Cargando equipos...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ justifyContent: 'center' }}>
              {error}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (hardware.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#000' }}>
              No hay equipos registrados
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return hardware.map((item) => (
      <TableRow 
        key={item.serial}
        sx={{ 
          '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
          '&:hover': { bgcolor: 'action.selected' },
          cursor: 'pointer'
        }}
      >
        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#000' }}>
          {item.serial}
        </TableCell>
        <TableCell sx={{ fontWeight: 'medium', color: '#000' }}>
          {item.name}
        </TableCell>
        <TableCell sx={{ color: '#000', fontSize: '0.875rem' }}>
          {item.description}
        </TableCell>
        <TableCell>
          <Chip 
            label={item.hardware_type_name || item.hardware_type} 
            size="small" 
            variant="outlined"
            sx={{ 
              borderRadius: 1,
              color: '#000',
              borderColor: '#000'
            }}
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={getStatusLabel(item.state)} 
            color={getStatusColor(item.state)}
            size="small"
            sx={{ borderRadius: 1, fontWeight: 'medium' }}
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={getAvailabilityLabel(item.available)} 
            color={getAvailabilityColor(item.available)}
            size="small"
            sx={{ borderRadius: 1, fontWeight: 'medium' }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(item.serial)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(item.serial)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [hardware, loading, error, onEdit, onDelete]);

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 0, 
        boxShadow: 'none',
        '& .MuiTable-root': {
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            '& .MuiTableCell-root': {
              backgroundColor: 'grey.100',
            },
          },
        },
      }}
    >
      <Table sx={{ minWidth: 650 }} stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Serial</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000' }}>Disponibilidad</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center', color: '#000' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HardwareTable;