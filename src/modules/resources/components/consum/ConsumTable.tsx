 import { useMemo } from 'react';
 import { Table, TableHead, TableRow, TableCell, TableBody, Alert, TableContainer, Paper, CircularProgress, Typography, Button, Stack } from '@mui/material';
 import type { Consum } from '../../model/Consum';
 
 interface ConsumTableProps {
   items?: Consum[];
   loading: boolean;
   error: string | null;
   onViewDetail?: (consum: Consum) => void;
 }
 
 const ConsumTable = ({ items = [], loading, error, onViewDetail }: ConsumTableProps) => {
   const tableContent = useMemo(() => {
     if (loading) {
       return (
         <TableRow>
          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: '#000' }}>
              Cargando consumos...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }
 
     if (error) {
       return (
         <TableRow>
          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>
          </TableCell>
        </TableRow>
      );
    }
 
     if (items.length === 0) {
       return (
         <TableRow>
          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#000' }}>No hay consumos registrados</Typography>
          </TableCell>
        </TableRow>
      );
    }
 
     return items.map(consum => (
       <TableRow key={String((consum as any)?.id ?? Math.random())} hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:hover': { bgcolor: 'action.selected' } }}>
         <TableCell sx={{ fontWeight: 'medium', color: '#000', width: '30%' }}>
           {consum?.user?.names ?? '-'} {consum?.user?.surnames ?? ''}
         </TableCell>
         <TableCell sx={{ color: '#000', width: '25%' }}>
           {(consum as any)?.monitor?.first_name ?? '-'} {(consum as any)?.monitor?.last_name ?? ''}
         </TableCell>
         <TableCell sx={{ color: '#000', width: '40%' }}>
           <Typography variant="body2" sx={{ color: '#000', wordBreak: 'break-word', lineHeight: 1.4 }}>
             {(consum?.supplies ?? []).map(s => `${s?.name ?? '—'}${s?.quantity ? ` (x${s.quantity})` : ''}`).join(', ')}
           </Typography>
         </TableCell>
         <TableCell sx={{ width: '5%' }}>
           <Stack direction="row" spacing={1}>
             <Button
               variant="outlined"
               size="small"
               onClick={() => onViewDetail && onViewDetail(consum)}
             >
               Ver detalle
             </Button>
           </Stack>
         </TableCell>
       </TableRow>
     ));
   }, [items, loading, error, onViewDetail]);
 
   return (
     <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none', height: '100%', width: '100%', '& .MuiTable-root .MuiTableHead-root': { position: 'sticky', top: 0, zIndex: 10, '& .MuiTableCell-root': { backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0' } } }}>
       <Table sx={{ width: '100%', tableLayout: 'auto' }} stickyHeader size="small">
         <TableHead>
           <TableRow sx={{ bgcolor: 'grey.100' }}>
             <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '30%' }}>Usuario</TableCell>
             <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '25%' }}>Monitor</TableCell>
             <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '40%' }}>Suministros entregados</TableCell>
             <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#000', backgroundColor: 'grey.100', borderBottom: '2px solid #e0e0e0', width: '5%' }}>Acciones</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>{tableContent}</TableBody>
       </Table>
     </TableContainer>
   );
 };
 
 export default ConsumTable;
 
