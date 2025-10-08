import { useMemo } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Chip, Alert, TableContainer, Paper, CircularProgress, Typography, Button, Stack } from '@mui/material';
import type { Loan } from '../../model/Loan';

interface LoansTableProps {
  loans?: Loan[];
  loading: boolean;
  error: string | null;
  onViewDetail?: (loan: Loan) => void;
  onCloseLoan?: (loan: Loan) => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'ABIERTO': return 'info';
    case 'CERRADO': return 'success';
    case 'VENCIDO': return 'error';
    default: return 'default';
  }
};

const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString() : '-';

const LoansTable = ({
  loans = [],
  loading,
  error,
  onViewDetail,
  onCloseLoan,
}: LoansTableProps) => {
  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: '#000' }}>
              Cargando préstamos...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (loans.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#000' }}>No hay préstamos registrados</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return loans.map(loan => (
      <TableRow key={loan.id} hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:hover': { bgcolor: 'action.selected' } }}>
        <TableCell sx={{ fontWeight: 'medium', color: '#000', width: '24%' }}>
          {loan.id_lender.names} {loan.id_lender.surnames}
        </TableCell>
        <TableCell sx={{ color: '#000', width: '24%' }}>
          <Typography variant="body2" sx={{ color: '#000', wordBreak: 'break-word', lineHeight: 1.4 }}>
            {loan.hardwares.map(hw => hw.hardware.name).join(', ')}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: '16%' }}>{formatDate(loan.loan_date)}</TableCell>
        <TableCell sx={{ width: '16%' }}>{formatDate(loan.return_date ?? undefined)}</TableCell>
        <TableCell sx={{ width: '20%' }}>
          <Chip label={loan.status} size="small" color={statusColor(loan.status)} sx={{ borderRadius: 1, fontWeight: 'medium' }} />
        </TableCell>
        <TableCell sx={{ width: '10%' }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => onViewDetail && onViewDetail(loan)}
            >
              Ver detalle
            </Button>
            {loan.status !== 'CERRADO' && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => onCloseLoan && onCloseLoan(loan)}
              >
                Cerrar
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    ));
  }, [loans, loading, error, onViewDetail, onCloseLoan]);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none', height: '100%', width: '100%', '& .MuiTable-root .MuiTableHead-root': { position: 'sticky', top: 0, zIndex: 10, '& .MuiTableCell-root': { backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0' } } }}>
      <Table sx={{ width: '100%', tableLayout: 'auto' }} stickyHeader size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '24%' }}>Responsable</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '24%' }}>Hardwares</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '16%' }}>Fecha inicio</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '16%' }}>Fecha fin</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '20%' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '10%' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableContent}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoansTable;
