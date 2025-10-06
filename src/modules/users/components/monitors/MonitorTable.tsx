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
  Person as PersonIcon,
  ChangeCircle as ChangeStateIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import type { Monitor } from "../../model/Monitor";
import { usePermissions } from "../../hook/usePermissions";

interface MonitorTableProps {
  monitors: Monitor[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getStateColor = (state: string): "success" | "warning" | "error" => {
  switch (state.toUpperCase()) {
    case 'ACTIVE':
    case 'ACTIVO':
      return "success";
    case 'INACTIVE':
    case 'INACTIVO':
      return "warning";
    case 'SUSPENDED':
    case 'SUSPENDIDO':
      return "error";
    default:
      return "warning";
  }
};

const formatStateName = (state: string): string => {
  switch (state.toUpperCase()) {
    case 'ACTIVE':
      return 'Activo';
    case 'INACTIVE':
      return 'Inactivo';
    case 'SUSPENDED':
      return 'Suspendido';
    default:
      return state;
  }
};

export const MonitorTable = ({ monitors, loading, error, onEdit, onDelete }: MonitorTableProps) => {
  const { canEditMonitor, canDeleteMonitor } = usePermissions();
  
  const tableContent = useMemo(() => {
    const safeMonitors = Array.isArray(monitors) ? monitors : [];
    
    const totalColumns = (canEditMonitor || canDeleteMonitor) ? 6 : 5;
    
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1, color: "#000" }}>
              Cargando monitores...
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

    if (safeMonitors.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={totalColumns} sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "#000" }}>
              No hay monitores registrados
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return safeMonitors.map((monitor) => (
      <TableRow
        key={monitor.id}
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
          {monitor.id}
        </TableCell>
        
        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "20%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {monitor.first_name || "-"}
        </TableCell>

        <TableCell sx={{ 
          fontWeight: "medium", 
          color: "#000",
          width: "20%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {monitor.last_name || "-"}
        </TableCell>

        <TableCell sx={{ width: "15%" }}>
          <Chip
            label={formatStateName(monitor.state)}
            size="small"
            color={getStateColor(monitor.state)}
            sx={{ 
              borderRadius: 1, 
              fontWeight: "medium",
              minWidth: 80
            }}
          />
        </TableCell>

        <TableCell sx={{ 
          color: "#000", 
          fontSize: "0.875rem", 
          width: "25%",
          fontFamily: "monospace",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            overflow: "hidden"
          }}>
            <PersonIcon fontSize="small" sx={{ 
              color: "primary.main",
              flexShrink: 0
            }} />
            <span style={{ 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap" 
            }}>
              {monitor.username || "-"}
            </span>
          </Box>
        </TableCell>

        {(canEditMonitor || canDeleteMonitor) && (
          <TableCell sx={{ textAlign: "center", width: "10%" }}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              {canEditMonitor && (
                <IconButton
                  size="small"
                  onClick={() => onEdit(monitor.id)}
                  sx={{ color: "primary.main" }}
                  title="Editar monitor"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {canDeleteMonitor && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(monitor.id)}
                  sx={{ color: "warning.main" }}
                  title="Cambiar estado del monitor"
                >
                  <ChangeStateIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </TableCell>
        )}
      </TableRow>
    ));
  }, [monitors, loading, error, onEdit, onDelete, canEditMonitor, canDeleteMonitor]);

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
                width: "20%",
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
                width: "20%",
              }}
            >
              Apellido
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
              Estado
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
              Usuario
            </TableCell>
            {(canEditMonitor || canDeleteMonitor) && (
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  color: "#000",
                  backgroundColor: "grey.100",
                  borderBottom: "2px solid #e0e0e0",
                  width: "10%",
                }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>{tableContent}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default MonitorTable;