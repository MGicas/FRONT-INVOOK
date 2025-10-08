import { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Chip, Stack, Typography } from '@mui/material';
import type { Loan } from '../../model/Loan';
import { createLoan, type CreateLoanRequest, pickLoanFromCreateResponse } from '../../service/createLoan';
import { useAuth } from '../../../../shared/hooks/useAuth';

interface LoansFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (created?: Loan) => void;
}

const LoansFormDialog = ({ open, onClose, onSuccess }: LoansFormDialogProps) => {
  const { user } = useAuth();
  const [idLender, setIdLender] = useState('');
  const monitorId = useMemo(() => user?.id ?? '', [user]);
  const [serialInput, setSerialInput] = useState('');
  const [serials, setSerials] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(idLender.trim().length > 0 && !!monitorId && serials.length > 0 && !submitting);
  }, [idLender, monitorId, serials, submitting]);

  const addSerial = () => {
    const s = serialInput.trim();
    if (!s) return;
    if (serials.includes(s)) { setSerialInput(''); return; }
    setSerials(prev => [...prev, s]);
    setSerialInput('');
  };

  const removeSerial = (s: string) => setSerials(prev => prev.filter(x => x !== s));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const payload: CreateLoanRequest = {
        action: 'create',
        id_lender: idLender,
        id_monitor: String(monitorId),
        serials_hardware: serials,
      };
      const resp = await createLoan(payload);
      const created = pickLoanFromCreateResponse(resp);
      if (created) onSuccess(created);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el préstamo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nuevo Préstamo</DialogTitle>
      <DialogContent dividers>
        {error && <Box sx={{ mb: 2, color: 'error.main', fontSize: 14 }}>{error}</Box>}
        <Stack spacing={2}>
          <TextField
            label="ID Prestamista (id_lender)"
            value={idLender}
            onChange={e => setIdLender(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="ID Monitor (id_monitor)"
            value={monitorId}
            InputProps={{ readOnly: true }}
            helperText={monitorId ? 'Tomado del usuario autenticado' : 'Inicia sesión para obtener id_monitor'}
            fullWidth
            size="small"
          />
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Serial de hardware"
                value={serialInput}
                onChange={e => setSerialInput(e.target.value)}
                size="small"
                fullWidth
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addSerial(); }
                }}
              />
              <Button variant="outlined" onClick={addSerial} disabled={!serialInput.trim() || submitting}>
                Agregar
              </Button>
            </Stack>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {serials.map(s => (
                <Chip key={s} label={s} onDelete={() => removeSerial(s)} />
              ))}
            </Box>
            {serials.length === 0 && (
              <Typography variant="caption" color="text.secondary">Agrega al menos un serial</Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="success" disabled={!canSubmit}>Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoansFormDialog;
