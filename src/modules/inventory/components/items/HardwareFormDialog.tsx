import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';
import type { HardwarePayload } from '../../service/HardwareService';

export type HardwareFormValues = HardwarePayload;

const STATE_OPTIONS = [
  'BUENO',
  'FUNCIONAL',
  'DAÑO_LEVE',
  'NO_FUNCIONA',
  'PERDIDO',
] as const;

interface Props {
  open: boolean;
  initialValues?: Partial<HardwareFormValues>;
  onClose: () => void;
  onSubmit: (values: HardwareFormValues, mode: 'create' | 'edit') => Promise<void> | void;
}

const defaultValues: HardwareFormValues = {
  serial: '',
  name: '',
  description: '',
  comment: '',
  hardware_type: '',
  state: 'BUENO',
  available: 'DISPONIBLE',
};

export default function HardwareFormDialog({ open, initialValues, onClose, onSubmit }: Props) {
  const isEdit = useMemo(() => Boolean(initialValues?.serial), [initialValues]);
  const [values, setValues] = useState<HardwareFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({ ...defaultValues, ...initialValues });
    }
  }, [open, initialValues]);

  const handleChange = (field: keyof HardwareFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values, isEdit ? 'edit' : 'create');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Editar equipo' : 'Agregar equipo'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Serial"
            value={values.serial}
            onChange={handleChange('serial')}
            disabled={isEdit}
            required
          />
          <TextField label="Nombre" value={values.name} onChange={handleChange('name')} required />
          <TextField label="Descripción" value={values.description || ''} onChange={handleChange('description')} multiline minRows={2} />
          <TextField label="Comentario" value={values.comment || ''} onChange={handleChange('comment')} multiline minRows={2} />
          <TextField label="Tipo de hardware" value={values.hardware_type || ''} onChange={handleChange('hardware_type')} />
          <TextField select label="Estado" value={values.state || ''} onChange={handleChange('state')}>
            {STATE_OPTIONS.map(opt => (
              <MenuItem key={opt} value={opt}>{opt.replace('_', ' ')}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Disponibilidad" value={values.available || ''} onChange={handleChange('available')}>
            <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
            <MenuItem value="NO_DISPONIBLE">NO_DISPONIBLE</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {isEdit ? 'Guardar cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
