 import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, IconButton, Typography, Box } from '@mui/material';
 import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
 import { useState } from 'react';
 
 interface ConsumFormDialogProps {
   open: boolean;
   onClose: () => void;
   onSuccess: () => void;
 }
 
 interface SupplyInput {
   name: string;
   quantity: number | '';
 }
 
 const ConsumFormDialog = ({ open, onClose, onSuccess }: ConsumFormDialogProps) => {
   const [user, setUser] = useState('');
   const [monitor, setMonitor] = useState('');
   const [supplies, setSupplies] = useState<SupplyInput[]>([{ name: '', quantity: '' }]);
 
   const addSupplyRow = () => setSupplies(prev => [...prev, { name: '', quantity: '' }]);
   const removeSupplyRow = (idx: number) => setSupplies(prev => prev.filter((_, i) => i !== idx));
   const handleSupplyChange = (idx: number, field: keyof SupplyInput, value: string) => {
     setSupplies(prev => prev.map((row, i) => i === idx ? { ...row, [field]: field === 'quantity' ? (value === '' ? '' : Number(value)) : value } : row));
   };
 
   const handleSubmit = () => {
     // Validación básica
     const hasInvalid = supplies.some(s => !s.name.trim() || s.quantity === '' || Number(s.quantity) <= 0);
     if (hasInvalid) return; // podrías mostrar error si se requiere
     // Aquí iría la lógica real de creación (postConsum)
     onSuccess();
   };
   return (
     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
       <DialogTitle>Nuevo Consumo</DialogTitle>
       <DialogContent dividers>
         <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Usuario" value={user} onChange={e => setUser(e.target.value)} fullWidth />
          <TextField label="Monitor" value={monitor} onChange={e => setMonitor(e.target.value)} fullWidth />
 
           <Stack spacing={1}>
             <Typography variant="subtitle2">Suministros</Typography>
             {supplies.map((row, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <Box sx={{ flex: 1.6 }}>
                  <TextField
                    label="Nombre del suministro"
                    value={row.name}
                    onChange={e => handleSupplyChange(idx, 'name', e.target.value)}
                    fullWidth
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={row.quantity}
                    onChange={e => handleSupplyChange(idx, 'quantity', e.target.value)}
                    fullWidth
                  />
                </Box>
                <IconButton aria-label="eliminar" onClick={() => removeSupplyRow(idx)} disabled={supplies.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
             <Button startIcon={<AddIcon />} onClick={addSupplyRow} sx={{ alignSelf: 'flex-start' }}>
               Agregar suministro
             </Button>
           </Stack>
         </Stack>
       </DialogContent>
       <DialogActions>
         <Button onClick={onClose}>Cancelar</Button>
         <Button onClick={handleSubmit} variant="contained">Crear</Button>
       </DialogActions>
     </Dialog>
   );
 };
 
 export default ConsumFormDialog;
