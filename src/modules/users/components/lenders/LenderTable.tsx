import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import type { Lender } from "../../model/Lender";

interface LenderTableProps {
  lenders: Lender[];
  loading: boolean;
  error: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getActiveColor = (active: boolean): "success" | "error" => {
  return active ? "success" : "error";
};

const formatActiveStatus = (active: boolean): string => {
  return active ? "Activo" : "Inactivo";
};

export const LenderTable = ({ lenders, loading, error, onEdit, onDelete }: LenderTableProps) => {
  const tableContent = useMemo(() => {
    const safeLenders = Array.isArray(lenders) ? lenders : [];
    const totalColumns = 7; // ID, RFID, Nombres, Apellidos, Email, Teléfono, Estado, Acciones
    
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
              Cargando lenders...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="error" sx={{ justifyContent: "center" }}>
              {error}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (safeLenders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "#000" }}>
              No hay lenders registrados
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return safeLenders.map((lender) => (
      <TableRow
        key={lender.id}
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
          width: "15%",
          fontWeight: "medium",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {lender.id}
        </TableCell>
        
        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "18%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {lender.names || "-"}
        </TableCell>

        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "18%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {lender.surnames || "-"}
        </TableCell>

        <TableCell sx={{ 
          color: "#000", 
          fontSize: "0.875rem", 
          width: "20%",
          fontFamily: "monospace",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {lender.email || "-"}
        </TableCell>

        <TableCell sx={{ 
          color: "#000", 
          fontSize: "0.875rem", 
          width: "15%",
          fontFamily: "monospace",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {lender.phone || "-"}
        </TableCell>

        <TableCell sx={{ width: "14%" }}>
          <Chip
            label={formatActiveStatus(lender.active)}
            size="small"
            color={getActiveColor(lender.active)}
            sx={{ 
              borderRadius: 1, 
              fontWeight: "medium",
              minWidth: 80
            }}
          />
        </TableCell>
        
        <TableCell sx={{ width: "12%", textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lender.id);
              }}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.light", color: "white" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(lender.id);
              }}
              sx={{
                color: "error.main",
                "&:hover": { backgroundColor: "error.light", color: "white" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [lenders, loading, error, onEdit, onDelete]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '0 0 8px 8px',
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
      <Table sx={{ 
        width: "100%", 
        tableLayout: "fixed",
        "& .MuiTableCell-root": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }
      }} stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "15%",
              }}
            >
              ID
            </TableCell>
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
              Nombres
            </TableCell>
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
              Apellidos
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "20%",
              }}
            >
              Email
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "15%",
              }}
            >
              Teléfono
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "14%",
              }}
            >
              Estado
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "12%",
                textAlign: "center",
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

export default LenderTable;