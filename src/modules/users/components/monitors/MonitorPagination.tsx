import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { useCallback } from 'react';

interface MonitorPaginationProps {
  currentPage: number;
  totalCount: number;
  showingCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const MonitorPagination = ({
  currentPage,
  totalCount,
  showingCount,
  hasNext,
  hasPrevious,
  loading,
  onPageChange,
  onNextPage,
  onPreviousPage,
}: MonitorPaginationProps) => {
  const itemsPerPage = 10; 
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFirstPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  const handleLastPage = useCallback(() => {
    onPageChange(totalPages);
  }, [onPageChange, totalPages]);

  if (totalCount <= itemsPerPage) {
    return null; 
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: '0 0 8px 8px',
        borderTop: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Mostrando {showingCount} de {totalCount} monitores
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Página {currentPage} de {totalPages}
        </Typography>

        <IconButton
          onClick={handleFirstPage}
          disabled={!hasPrevious || loading}
          size="small"
          sx={{ mr: 0.5 }}
        >
          <FirstPageIcon />
        </IconButton>

        <IconButton
          onClick={onPreviousPage}
          disabled={!hasPrevious || loading}
          size="small"
        >
          <ChevronLeftIcon />
        </IconButton>

        <Button
          variant="outlined"
          size="small"
          disabled
          sx={{ mx: 1, minWidth: 40 }}
        >
          {currentPage}
        </Button>

        <IconButton
          onClick={onNextPage}
          disabled={!hasNext || loading}
          size="small"
        >
          <ChevronRightIcon />
        </IconButton>

        <IconButton
          onClick={handleLastPage}
          disabled={!hasNext || loading}
          size="small"
          sx={{ ml: 0.5 }}
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MonitorPagination;