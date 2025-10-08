import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import type { Consum } from '../../model/Consum';

interface ConsumDetailDialogProps {
  open: boolean;
  detail: Consum | null;
  onClose: () => void;
}

const ConsumDetailDialog = ({ open, detail, onClose }: ConsumDetailDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle de Consumo</DialogTitle>
      <DialogContent dividers>
        {detail ? (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Usuario:</strong> {detail?.user?.names ?? '-'}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Monitor:</strong> {(detail as any)?.monitor?.first_name ?? '-'}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Suministros entregados:</strong>
            </Typography>
            <List>
              {(detail?.supplies ?? []).map((s: any, idx: number) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={`${s?.name ?? '—'}${s?.quantity ? ` (x${s.quantity})` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography>No se encontró información del consumo.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsumDetailDialog;
