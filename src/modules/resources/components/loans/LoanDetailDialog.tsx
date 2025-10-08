import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Chip, Divider, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getLoan } from "../../service/getLoan";
// Removed unused updateHardwareState and updateLoan imports after switching to returnLoanHardware service
import { returnLoanHardware, pickLoanFromResponse } from "../../service/returnLoanHardware";
import type { Loan } from "../../model/Loan";

const HARDWARE_STATES = [
  "BUENO",
  "FUNCIONAL",
  "DAÑADO",
  "PERDIDO",
  "REPARACIÓN",
];

interface LoanDetailDialogProps {
  open: boolean;
  loanId: string | null;
  onClose: () => void;
}

interface HardwareReturnState {
  [serial: string]: string;
}

const LoanDetailDialog = ({ open, loanId, onClose }: LoanDetailDialogProps) => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);
  const [returnStates, setReturnStates] = useState<HardwareReturnState>({});
  const [selectedToReturn, setSelectedToReturn] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [returningSerial, setReturningSerial] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  // Carga el préstamo cada vez que se abre el dialog
  useEffect(() => {
    if (open && loanId) {
      setLoading(true);
      getLoan(loanId)
        .then(data => {
          setLoan(data);
          const initialStates: HardwareReturnState = {};
          data.hardwares.forEach(hw => {
            initialStates[hw.hardware.serial] = hw.hardware.state;
          });
          setReturnStates(initialStates);
          setSelectedToReturn([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, loanId]);

  // Selecciona/des-selecciona hardware para retornar
  const handleToggleReturn = (serial: string) => {
    setSelectedToReturn(selected =>
      selected.includes(serial)
        ? selected.filter(s => s !== serial)
        : [...selected, serial]
    );
  };

  // Cambia el estado de retorno para un hardware
  const handleChangeReturnState = (serial: string, state: string) => {
    setReturnStates(prev => ({ ...prev, [serial]: state }));
  };

  // Retorna y guarda un solo hardware de inmediato
  const handleReturnOne = async (serial: string) => {
    if (!loan) return;
    setReturningSerial(serial);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Backend contract: POST action return_hardware
      const updatedResp = await returnLoanHardware({
        action: 'return_hardware',
        id_monitor: String(loan.id_monitor.id),
        serials_hardware: [{ serial, state: returnStates[serial] }],
      });
      const picked = pickLoanFromResponse(updatedResp, loan.id);
      const refreshed = await getLoan(picked?.id ?? loan.id);
      setLoan(refreshed);

      // Quita de la selección por si estaba en batch
      setSelectedToReturn(prev => prev.filter(s => s !== serial));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    } catch (err) {
      setSaveError("No se pudo guardar los cambios del hardware.");
    } finally {
      setReturningSerial(null);
    }
  };

  // Guarda los cambios en el backend (batch)
  const handleSaveChanges = async () => {
    if (!loan) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Envía todos los seleccionados en un solo POST según contrato
      const serials_hardware = selectedToReturn.map(s => ({ serial: s, state: returnStates[s] }));
      const updatedResp = await returnLoanHardware({
        action: 'return_hardware',
        id_monitor: String(loan.id_monitor.id),
        serials_hardware,
      });
      const picked = pickLoanFromResponse(updatedResp, loan.id);
      const refreshed = await getLoan(picked?.id ?? loan.id);
      setLoan(refreshed);

      setSaveSuccess(true);
      setSelectedToReturn([]);
      setTimeout(() => setSaveSuccess(false), 1500);
    } catch (err) {
      setSaveError("No se pudo guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const isClosed = loan?.status === "CERRADO";

  // Inicia el flujo de cierre: si hay pendientes por retornar, pedir estados y confirmar
  const handleRequestClose = () => {
    if (!loan) return onClose();
    const hasPending = loan.hardwares.some(hw => !hw.returned_at);
    if (!isClosed && hasPending) {
      setConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  // Confirma cierre: retorna todos los pendientes con los estados seleccionados y cierra
  const handleConfirmClose = async () => {
    if (!loan) return;
    setSaving(true);
    setSaveError(null);
    try {
      const pending = loan.hardwares.filter(hw => !hw.returned_at);
      const serials_hardware = pending.map(hw => ({
        serial: hw.hardware.serial,
        state: returnStates[hw.hardware.serial] || HARDWARE_STATES[0],
      }));
      if (serials_hardware.length > 0) {
        const updatedResp = await returnLoanHardware({
          action: 'return_hardware',
          id_monitor: String(loan.id_monitor.id),
          serials_hardware,
        });
        const picked = pickLoanFromResponse(updatedResp, loan.id);
        const refreshed = await getLoan(picked?.id ?? loan.id);
        setLoan(refreshed);
      }
      setConfirmCloseOpen(false);
      onClose();
    } catch (e) {
      setSaveError('No se pudo cerrar el préstamo.');
    } finally {
      setSaving(false);
    }
  };

  const pendingHardwares = loan?.hardwares.filter(hw => !hw.returned_at) ?? [];

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del Préstamo</DialogTitle>
      <DialogContent dividers>
        {loading && <Typography>Cargando...</Typography>}
        {loan && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Responsable:</strong> {loan.id_lender.names} {loan.id_lender.surnames} ({loan.id_lender.email})
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Monitor:</strong> {loan.id_monitor.first_name} {loan.id_monitor.last_name} ({loan.id_monitor.email})
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Estado:</strong> <Chip label={loan.status} color={loan.status === "ABIERTO" ? "info" : loan.status === "CERRADO" ? "success" : "warning"} />
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Fecha préstamo:</strong> {loan.loan_date}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Fecha devolución:</strong> {loan.return_date || "-"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Hardwares prestados:</strong>
            </Typography>
            <List>
              {loan.hardwares.map((hwItem, idx) => (
                <ListItem key={idx} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>{hwItem.hardware.name}</Typography>
                  <ListItemText
                    primary={`Serial: ${hwItem.hardware.serial}`}
                    secondary={
                      <>
                        <Typography variant="body2">Tipo: {hwItem.hardware.hardware_type_name}</Typography>
                        <Typography variant="body2">Estado: {hwItem.hardware.state}</Typography>
                        <Typography variant="body2">Disponibilidad: {isClosed ? 'DISPONIBLE' : hwItem.hardware.available}</Typography>
                        <Typography variant="body2">Descripción: {hwItem.hardware.description}</Typography>
                        <Typography variant="body2">Comentario: {hwItem.hardware.comment}</Typography>
                        <Typography variant="body2">
                          {hwItem.returned_at
                            ? `Retornado el ${new Date(hwItem.returned_at).toLocaleString()} (${hwItem.return_state ?? hwItem.hardware.state})`
                            : isClosed
                              ? `Retornado (préstamo cerrado)`
                              : "No retornado"}
                        </Typography>
                      </>
                    }
                  />
                  {!isClosed && !hwItem.returned_at && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id={`estado-${hwItem.hardware.serial}`}>Estado</InputLabel>
                        <Select
                          labelId={`estado-${hwItem.hardware.serial}`}
                          value={returnStates[hwItem.hardware.serial] || HARDWARE_STATES[0]}
                          label="Estado"
                          onChange={e => handleChangeReturnState(hwItem.hardware.serial, e.target.value as string)}
                          disabled={saving}
                        >
                          {HARDWARE_STATES.map(state => (
                            <MenuItem key={state} value={state}>{state}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleReturnOne(hwItem.hardware.serial)}
                        disabled={saving || returningSerial === hwItem.hardware.serial}
                      >
                        {returningSerial === hwItem.hardware.serial ? "Guardando..." : "Retornar"}
                      </Button>
                      <Button
                        variant={selectedToReturn.includes(hwItem.hardware.serial) ? "contained" : "outlined"}
                        color="success"
                        size="small"
                        onClick={() => handleToggleReturn(hwItem.hardware.serial)}
                        disabled={saving}
                      >
                        {selectedToReturn.includes(hwItem.hardware.serial) ? "Quitar" : "Seleccionar"}
                      </Button>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                </ListItem>
              ))}
            </List>
            {saveError && <Typography color="error" sx={{ mt: 2 }}>{saveError}</Typography>}
            {saveSuccess && <Typography color="success.main" sx={{ mt: 2 }}>¡cambios guardados!</Typography>}
          </>
        )}
        {!loading && !loan && <Typography>No se encontró información del préstamo.</Typography>}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveChanges}
          disabled={isClosed || saving || selectedToReturn.length === 0}
          color="success"
          variant="contained"
        >
          Guardar cambios
        </Button>
        <Button onClick={handleRequestClose} disabled={saving}>Cerrar</Button>
      </DialogActions>
    </Dialog>

    {/* Confirmación de cierre: seleccionar estados para todos los pendientes */}
    <Dialog open={confirmCloseOpen} onClose={() => !saving && setConfirmCloseOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar cierre de préstamo</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selecciona el estado de retorno para cada hardware pendiente antes de cerrar.
        </Typography>
        <List>
            {pendingHardwares.map((hwItem, idx) => (
              <ListItem key={idx} sx={{ gap: 2 }}>
                <ListItemText primary={`${hwItem.hardware.name} (Serial: ${hwItem.hardware.serial})`} />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id={`estado-close-${hwItem.hardware.serial}`}>Estado</InputLabel>
                  <Select
                    labelId={`estado-close-${hwItem.hardware.serial}`}
                    value={returnStates[hwItem.hardware.serial] || HARDWARE_STATES[0]}
                    label="Estado"
                    onChange={e => handleChangeReturnState(hwItem.hardware.serial, e.target.value as string)}
                    disabled={saving}
                  >
                    {HARDWARE_STATES.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
            ))}
          </List>
        {saveError && <Typography color="error" sx={{ mt: 1 }}>{saveError}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmCloseOpen(false)} disabled={saving}>Cancelar</Button>
        <Button onClick={handleConfirmClose} color="success" variant="contained" disabled={saving}>
          Confirmar cierre
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default LoanDetailDialog;

/*
// Ejemplo de uso en MainLoans.tsx
const [detailLoanId, setDetailLoanId] = useState<string | null>(null);
const handleViewDetail = (loan: Loan) => setDetailLoanId(loan.id);
<LoanDetailDialog open={!!detailLoanId} loanId={detailLoanId} onClose={() => setDetailLoanId(null)} />;
*/