import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import type { Consum } from "../../model/Consum";

interface ConsumDetailDialogProps {
  open: boolean;
  onClose: () => void;
  consum: Consum | null;
}

export const ConsumDetailDialog = ({ open, onClose, consum }: ConsumDetailDialogProps) => {
  if (!consum) return null;

  const hasSupplies = consum.supplies_detail && consum.supplies_detail.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <InventoryIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Detalles del Consumo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {consum.id}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: "auto", p: 1 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            Información General
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Prestamista
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {consum.id_lender}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Monitor
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {consum.id_monitor}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            Suministros Consumidos
            <Chip
              label={hasSupplies ? `${consum.supplies_detail!.length} items` : "Sin items"}
              size="small"
              color={hasSupplies ? "success" : "default"}
              sx={{ ml: 1 }}
            />
          </Typography>
          
          {hasSupplies ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Suministro</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consum.supplies_detail!.map((supply, index) => (
                    <TableRow
                      key={`${supply.supply_code}-${index}`}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                      }}
                    >
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {supply.supply_code}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {supply.supply}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                        {supply.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "grey.50",
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No hay suministros asociados a este consumo
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsumDetailDialog;