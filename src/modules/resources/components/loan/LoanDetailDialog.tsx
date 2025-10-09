import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Close, Add, Assignment, Lock } from "@mui/icons-material";
import type { Loan } from "../../model/Loan";

interface LoanDetailDialogProps {
  open: boolean;
  onClose: () => void;
  loan: Loan | null;
  onAddHardware?: (loan: Loan) => void;
  onReturnHardware?: (loan: Loan) => void;
  onCloseLoan?: (loan: Loan) => void;
}

const LoanDetailDialog = ({ 
  open, 
  onClose, 
  loan,
  onAddHardware,
  onReturnHardware,
  onCloseLoan 
}: LoanDetailDialogProps) => {
  if (!loan) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      ABIERTO: { color: "warning" as const, label: "Abierto" },
      CERRADO: { color: "success" as const, label: "Cerrado" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default" as const,
      label: status,
    };

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getHardwareStateChip = (state: string) => {
    const stateConfig = {
      BUENO: { color: "success" as const },
      FUNCIONAL: { color: "info" as const },
      DAÑADO: { color: "error" as const },
      EN_REPARACION: { color: "warning" as const },
    };

    const config = stateConfig[state as keyof typeof stateConfig] || {
      color: "default" as const,
    };

    return (
      <Chip
        label={state}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getAvailabilityChip = (available: string) => {
    const availabilityConfig = {
      DISPONIBLE: { color: "success" as const },
      NO_DISPONIBLE: { color: "error" as const },
      EN_MANTENIMIENTO: { color: "warning" as const },
    };

    const config = availabilityConfig[available as keyof typeof availabilityConfig] || {
      color: "default" as const,
    };

    return (
      <Chip
        label={available.replace("_", " ")}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Detalles del Préstamo</Typography>
        <Button onClick={onClose} color="inherit" sx={{ minWidth: "auto", p: 1 }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Información General
          </Typography>
          
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                ID del Préstamo
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {loan.id}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Estado
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {getStatusChip(loan.status)}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Fecha de Préstamo
              </Typography>
              <Typography variant="body1">
                {formatDate(loan.loan_date)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Fecha de Devolución
              </Typography>
              <Typography variant="body1">
                {formatDate(loan.return_date)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Prestamista
          </Typography>
          
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nombre Completo
              </Typography>
              <Typography variant="body1">
                {`${loan.id_lender.names} ${loan.id_lender.surnames}`}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body1">
                {loan.id_lender.id}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {loan.id_lender.email}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Teléfono
              </Typography>
              <Typography variant="body1">
                {loan.id_lender.phone}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                RFID
              </Typography>
              <Typography variant="body1">
                {loan.id_lender.rfid}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Estado
              </Typography>
              <Chip
                label={loan.id_lender.active ? "Activo" : "Inactivo"}
                color={loan.id_lender.active ? "success" : "error"}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Monitor
          </Typography>
          
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Usuario
              </Typography>
              <Typography variant="body1">
                {loan.id_monitor.username}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body1">
                {loan.id_monitor.id}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {loan.id_monitor.email}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Rol
              </Typography>
              <Typography variant="body1">
                {loan.id_monitor.role}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1">
                {loan.id_monitor.first_name || "N/A"} {loan.id_monitor.last_name || ""}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Estado
              </Typography>
              <Chip
                label={loan.id_monitor.state}
                color={loan.id_monitor.state === "ACTIVO" ? "success" : "error"}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            Hardware Prestado ({loan.hardwares.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Serial</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Disponibilidad</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Devuelto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loan.hardwares.map((item) => (
                  <TableRow key={item.hardware.serial}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.hardware.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.hardware.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {item.hardware.serial}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.hardware.hardware_type_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getHardwareStateChip(item.hardware.state)}
                    </TableCell>
                    <TableCell>
                      {getAvailabilityChip(item.hardware.available)}
                    </TableCell>
                    <TableCell>
                      {item.returned_at ? (
                        <Box>
                          <Chip label="Sí" color="success" size="small" />
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {formatDate(item.returned_at)}
                          </Typography>
                        </Box>
                      ) : (
                        <Chip label="No" color="warning" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 2 }}>
        {/* Botones de acción solo si el préstamo está abierto */}
        {loan.status === 'ABIERTO' && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {onAddHardware && (
              <Button
                onClick={() => onAddHardware(loan)}
                variant="outlined"
                startIcon={<Add />}
                size="small"
              >
                Agregar Hardware
              </Button>
            )}
            
            {onReturnHardware && loan.hardwares.some(item => !item.returned_at) && (
              <Button
                onClick={() => onReturnHardware(loan)}
                variant="outlined"
                startIcon={<Assignment />}
                size="small"
                color="info"
              >
                Devolver Hardware
              </Button>
            )}
            
            {onCloseLoan && (
              <Button
                onClick={() => onCloseLoan(loan)}
                variant="outlined"
                startIcon={<Lock />}
                size="small"
                color="warning"
              >
                Cerrar Préstamo
              </Button>
            )}
          </Box>
        )}
        
        {/* Botón cerrar diálogo */}
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanDetailDialog;