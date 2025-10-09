import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Box
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import type { Consum } from "../../model/Consum";

interface ConsumTableProps {
  consums: Consum[];
  loading: boolean;
  error: string | null;
  onViewDetails: (consum: Consum) => void;
}

export const ConsumTable = ({ consums, loading, error, onViewDetails }: ConsumTableProps) => {
  const tableContent = useMemo(() => {
    const safeConsums = Array.isArray(consums) ? consums : [];
    const totalColumns = 5;
    
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
              Cargando consumos...
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

    if (safeConsums.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "#000" }}>
              No hay consumos registrados
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return safeConsums.map((consum) => (
      <TableRow
        key={consum.id}
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
          width: "25%",
          fontWeight: "medium",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {consum.id}
        </TableCell>
        
        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "30%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {consum.id_lender}
        </TableCell>

        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "25%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {consum.id_monitor}
        </TableCell>        
        <TableCell sx={{ width: "8%", textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(consum);
              }}
              disabled={!consum.supplies_detail || consum.supplies_detail.length === 0}
              sx={{
                color: consum.supplies_detail && consum.supplies_detail.length > 0 ? "primary.main" : "disabled",
                "&:hover": { 
                  backgroundColor: "primary.light", 
                  color: "white" 
                },
                "&:disabled": {
                  color: "text.disabled"
                }
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [consums, loading, error, onViewDetails]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '0 0 8px 8px',
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxHeight: "60vh",
        minHeight: "400px", 
        width: "100%",
        overflow: "auto", 
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
                width: "25%",
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
                width: "30%",
              }}
            >
              Prestamista
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "25%",
              }}
            >
              Monitor
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "0.875rem",
                color: "#000",
                backgroundColor: "grey.100",
                borderBottom: "2px solid #e0e0e0",
                width: "8%",
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

export default ConsumTable;