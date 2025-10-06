import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import type { Supply } from "../../model/Supply";

interface SupplyTableProps {
  supplies: Supply[];
  loading: boolean;
  error: string | null;
  onEdit: (codigo: string) => void;
  onDelete: (codigo: string) => void;
  onRestock: (codigo: string) => void;
}

const getStockColor = (existencia: number, cantidad: number): "success" | "warning" | "error" => {
  const percentage = cantidad > 0 ? (existencia / cantidad) * 100 : 0;
  
  if (percentage >= 50) return "success";
  if (percentage >= 20) return "warning";
  return "error";
};

const getStockIcon = (existencia: number, cantidad: number) => {
  const percentage = cantidad > 0 ? (existencia / cantidad) * 100 : 0;
  
  if (percentage < 20) {
    return <WarningIcon fontSize="small" sx={{ color: "error.main" }} />;
  }
  return null;
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("es-CO").format(num);
};

export const SupplyTable = ({ supplies, loading, error, onEdit, onDelete, onRestock }: SupplyTableProps) => {
  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
              Cargando suministros...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="error" sx={{ justifyContent: "center" }}>
              {error}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (supplies.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "#000" }}>
              No hay suministros registrados
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return supplies.map((supply) => (
      <TableRow
        key={supply.code}
        sx={{
          "&:nth-of-type(odd)": { bgcolor: "action.hover" },
          "&:hover": { bgcolor: "action.selected" },
          cursor: "pointer",
        }}
      >
        <TableCell sx={{ 
          fontFamily: "monospace", 
          fontSize: "0.875rem", 
          color: "#000",
          width: "18%",
          wordBreak: "break-all"
        }}>
          {supply.code}
        </TableCell>
        <TableCell sx={{ width: "12%" }}>
          <Chip
            label={supply.supply_type}
            size="small"
            variant="filled"
            sx={{
              borderRadius: 1,
              backgroundColor: "primary.100",
              color: "primary.800",
              fontWeight: "medium",
              fontSize: "0.75rem",
            }}
          />
        </TableCell>
        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "16%",
          wordBreak: "break-word"
        }}>
          {supply.name}
        </TableCell>
        <TableCell sx={{ 
          color: "#000", 
          fontSize: "0.875rem", 
          width: "28%"
        }}>
          <Typography variant="body2" sx={{ 
            color: "#000",
            wordBreak: "break-word",
            lineHeight: 1.4
          }}>
            {supply.description}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: "8%" }}>
          <Chip
            label={supply.count}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 1,
              color: "#000",
              borderColor: "#000",
            }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: "right", width: "10%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
            {getStockIcon(supply.stock, supply.quantity)}
            <Chip
              label={formatNumber(supply.stock)}
              size="small"
              color={getStockColor(supply.stock, supply.quantity)}
              sx={{ borderRadius: 1, fontWeight: "medium", minWidth: 60 }}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ textAlign: "right", width: "8%" }}>
          <Typography variant="body2" sx={{ fontWeight: "medium", color: "#000" }}>
            {formatNumber(supply.quantity)}
          </Typography>
        </TableCell>
        <TableCell sx={{ textAlign: "center", width: "auto" }}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <IconButton
              size="small"
              onClick={() => onRestock(supply.code)}
              sx={{ color: "success.main" }}
              title="Reabastecer"
            >
              <InventoryIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onEdit(supply.code)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(supply.code)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [supplies, loading, error, onEdit, onDelete, onRestock]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 0,
        boxShadow: "none",
        height: "100%",
        width: "100%",
        "& .MuiTable-root": {
          "& .MuiTableHead-root": {
            position: "sticky",
            top: 0,
            zIndex: 10,
            "& .MuiTableCell-root": {
              backgroundColor: "grey.100",
              borderBottom: "2px solid #e0e0e0",
            },
          },
        },
      }}
    >
      <Table sx={{ width: "100%", tableLayout: "auto" }} stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "18%",
              }}
            >
              Código
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "12%",
              }}
            >
              Tipo
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "16%",
              }}
            >
              Nombre
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "28%",
              }}
            >
              Descripción
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "8%",
              }}
            >
              Cuenta
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                textAlign: "right",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "10%",
              }}
            >
              Existencia
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                textAlign: "right",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "8%",
              }}
            >
              Cantidad
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                textAlign: "center",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "auto",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableContent}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupplyTable;