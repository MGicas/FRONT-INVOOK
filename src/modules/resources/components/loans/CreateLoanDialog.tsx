import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { createLoan, type CreateLoanRequest, pickLoanFromCreateResponse } from '../../service/createLoan';
import type { Loan } from '../../model/Loan';

export interface CreateLoanDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (loan: Loan) => void; // callback con el préstamo creado
}

export default function CreateLoanDialog({ open, onClose, onCreated }: CreateLoanDialogProps) {
  const [idLender, setIdLender] = useState('');
  const [idMonitor, setIdMonitor] = useState('');
  const [serialInput, setSerialInput] = useState('');
  const [serials, setSerials] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return idLender.trim().length > 0 && idMonitor.trim().length > 0 && serials.length > 0 && !saving;
  }, [idLender, idMonitor, serials, saving]);

  const addSerial = () => {
    const s = serialInput.trim();
    if (!s) return;
    if (serials.includes(s)) {
      setSerialInput('');
      return;
    }
    setSerials(prev => [...prev, s]);
    setSerialInput('');
  };

  const removeSerial = (s: string) => {
    setSerials(prev => prev.filter(x => x !== s));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload: CreateLoanRequest = {
        action: 'create',
        id_lender: idLender,
        id_monitor: idMonitor,
        serials_hardware: serials,
      };
      const resp = await createLoan(payload);
      const loan = pickLoanFromCreateResponse(resp);
      if (loan) {
        setSuccessMsg('Préstamo creado exitosamente.');
        onCreated?.(loan);
        // Limpieza y cerrar
        setTimeout(() => {
          setIdLender('');
          setIdMonitor('');
          setSerials([]);
          setSerialInput('');
          setSuccessMsg(null);
          onClose();
        }, 800);
      } else {
        setError('No se recibió información del préstamo creado.');
      }
    } catch (e: any) {
      setError(e?.message || 'No se pudo crear el préstamo.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear nuevo préstamo</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="ID Prestamista (id_lender)"
            value={idLender}
            onChange={e => setIdLender(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="ID Monitor (id_monitor)"
            value={idMonitor}
            onChange={e => setIdMonitor(e.target.value)}
            size="small"
            fullWidth
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
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSerial();
                  }
                }}
              />
              <Button variant="outlined" onClick={addSerial} disabled={!serialInput.trim() || saving}>
                Agregar
              </Button>
            </Stack>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {serials.map(s => (
                <Chip key={s} label={s} onDelete={() => removeSerial(s)} />
              ))}
            </Box>
          </Box>

          {error && (
            <Typography color="error">{error}</Typography>
          )}
          {successMsg && (
            <Typography color="success.main">{successMsg}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained" color="success">
          Crear préstamo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
