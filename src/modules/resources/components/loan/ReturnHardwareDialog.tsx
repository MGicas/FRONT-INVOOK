import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Close } from "@mui/icons-material";
import { useReturnHardware } from "../../hook/useReturnHardware";
import { getMonitorById } from "../../../users/service/getMonitor";

import type { Loan, HardwareState } from "../../model/Loan";

interface ReturnHardwareDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  loan: Loan | null;
}

interface HardwareReturnForm {
  serial: string;
  name: string;
  selected: boolean;
  state: HardwareState;
  isReturned: boolean;
}

const ReturnHardwareDialog = ({ open, onClose, onSuccess, onError, loan }: ReturnHardwareDialogProps) => {
  const { returnHardwareMutation, loading, error } = useReturnHardware();
  const [monitorId, setMonitorId] = useState("");
  const [hardwareList, setHardwareList] = useState<HardwareReturnForm[]>([]);
  const [monitorValid, setMonitorValid] = useState(true);
  const [monitorHelper, setMonitorHelper] = useState<string>("");
  const [validatingMonitor, setValidatingMonitor] = useState(false);

  // Inicializar la lista de hardware cuando se abre el diálogo
  useEffect(() => {
    if (loan && open) {
      const list = loan.hardwares.map(item => ({
        serial: item.hardware.serial,
        name: item.hardware.name,
        selected: false,
        state: 'BUENO' as HardwareState,
        isReturned: !!item.returned_at
      }));
      setHardwareList(list);
      setMonitorId(loan.id_monitor.id.toString());
      setMonitorValid(true);
      setMonitorHelper("");
    }
  }, [loan, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan) return;

    const selectedHardware = hardwareList
      .filter(item => item.selected && !item.isReturned)
      .map(item => ({
        serial: item.serial,
        state: item.state
      }));

    if (selectedHardware.length === 0) return;

    try {
      await returnHardwareMutation(loan.id, monitorId, selectedHardware);
      onSuccess("Equipo devuelto correctamente");
      onClose();
      handleReset();
    } catch (error) {
      console.error("Error devolviendo equipo:", error);
      onError("No fue posible devolver el equipo");
    }
  };

  const handleReset = () => {
    setMonitorId("");
    setHardwareList([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleHardwareSelection = (serial: string, checked: boolean) => {
    setHardwareList(prev => 
      prev.map(item => 
        item.serial === serial ? { ...item, selected: checked } : item
      )
    );
  };

  const handleStateChange = (serial: string, state: HardwareState) => {
    setHardwareList(prev => 
      prev.map(item => 
        item.serial === serial ? { ...item, state } : item
      )
    );
  };

  const selectAll = () => {
    const availableItems = hardwareList.filter(item => !item.isReturned);
    const allSelected = availableItems.every(item => item.selected);
    
    setHardwareList(prev => 
      prev.map(item => 
        item.isReturned ? item : { ...item, selected: !allSelected }
      )
    );
  };

  const selectedCount = hardwareList.filter(item => item.selected && !item.isReturned).length;
  const availableCount = hardwareList.filter(item => !item.isReturned).length;
  const isFormValid = selectedCount > 0 && monitorValid && !!monitorId && !validatingMonitor;

  const validateMonitor = async () => {
    const id = monitorId.trim();
    if (!id) {
      setMonitorValid(false);
      setMonitorHelper("Ingresa el ID del monitor");
      return;
    }
    if (!/^\d+$/.test(id)) {
      setMonitorValid(false);
      setMonitorHelper("El ID debe ser numérico");
      return;
    }
    try {
      setValidatingMonitor(true);
      await getMonitorById(id);
      setMonitorValid(true);
      setMonitorHelper("ID válido");
    } catch (e) {
      setMonitorValid(false);
      setMonitorHelper("ID de monitor no existe");
    } finally {
      setValidatingMonitor(false);
    }
  };

  const hardwareStates: { value: HardwareState; label: string; color: string }[] = [
    { value: 'BUENO', label: 'Bueno', color: '#4caf50' },
    { value: 'FUNCIONAL', label: 'Funcional', color: '#2196f3' },
    { value: 'DAÑO_LEVE', label: 'Daño leve', color: '#f44336' },
    { value: 'NO_FUNCIONA', label: 'No funciona', color: '#ff5722' },
    { value: 'PERDIDO', label: 'Perdido', color: '#ff9800' },
  ];

  if (loan?.status === 'CLOSED') {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Préstamo ya finalizado</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Este préstamo ya fue devuelto completamente y no se pueden registrar más devoluciones.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }


  if (!loan) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Devolver Hardware del Préstamo</Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información del préstamo */}
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Información del Préstamo
              </Typography>
              <Typography variant="body2">
                <strong>ID:</strong> {loan.id}
              </Typography>
              <Typography variant="body2">
                <strong>Prestamista:</strong> {loan.id_lender.names} {loan.id_lender.surnames}
              </Typography>
              <Typography variant="body2">
                <strong>Estado:</strong> {loan.status}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha Préstamo:</strong> {new Date(loan.loan_date).toLocaleDateString('es-ES')}
              </Typography>
            </Box>

            {/* Monitor responsable por ID */}
            <FormControl fullWidth required>
              <TextField
                label="Monitor Responsable (ID)"
                value={monitorId}
                onChange={(e) => {
                  setMonitorId(e.target.value);
                  setMonitorValid(false);
                  setMonitorHelper("");
                }}
                onBlur={validateMonitor}
                disabled={loading}
                error={!monitorValid}
                helperText={monitorHelper}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
            </FormControl>

            {/* Selección de hardware */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Hardware a Devolver ({selectedCount} de {availableCount} seleccionados)
                </Typography>
                {availableCount > 0 && (
                  <Button
                    onClick={selectAll}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                  >
                    {selectedCount === availableCount ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                  </Button>
                )}
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Seleccionar</TableCell>
                      <TableCell>Serial</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Estado de Devolución</TableCell>
                      <TableCell>Estado Actual</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hardwareList.map((item) => (
                      <TableRow 
                        key={item.serial}
                        sx={{ 
                          bgcolor: item.isReturned ? 'grey.100' : 'inherit',
                          opacity: item.isReturned ? 0.6 : 1
                        }}
                      >
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item.selected}
                                onChange={(e) => handleHardwareSelection(item.serial, e.target.checked)}
                                disabled={loading || item.isReturned}
                              />
                            }
                            label=""
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {item.serial}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.isReturned ? (
                            <Typography variant="body2" color="success.main" fontWeight={500}>
                              Ya devuelto
                            </Typography>
                          ) : (
                            <FormControl size="small" fullWidth disabled={!item.selected || loading}>
                              <Select
                                value={item.state}
                                onChange={(e: SelectChangeEvent<HardwareState>) => handleStateChange(item.serial, e.target.value as HardwareState)}
                              >
                                {hardwareStates.map((state) => (
                                  <MenuItem key={state.value} value={state.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: '50%',
                                          bgcolor: state.color,
                                        }}
                                      />
                                      {state.label}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {loan.hardwares.find(h => h.hardware.serial === item.serial)?.hardware.state}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || loading}
          >
            {loading ? "Procesando..." : `Devolver Hardware (${selectedCount})`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReturnHardwareDialog;