import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import { 
  Visibility, 
  Add, 
  Reply, 
  Done
} from "@mui/icons-material";
import type { Loan } from "../../model/Loan";

interface LoanTableProps {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  onViewDetails: (loan: Loan) => void;
  onAddHardware?: (loan: Loan) => void;
  onReturnHardware?: (loan: Loan) => void;
  onCloseLoan?: (loan: Loan) => void;
}

const LoanTable = ({ 
  loans, 
  loading, 
  error, 
  onViewDetails, 
  onAddHardware, 
  onReturnHardware, 
  onCloseLoan 
}: LoanTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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

  const renderHardwareList = (hardwares: Loan["hardwares"]) => {
    if (hardwares.length === 0) return "Sin hardware";
    
    if (hardwares.length === 1) {
      return hardwares[0].hardware.name;
    }

    return (
      <Tooltip
        title={
          <Box>
            {hardwares.map((item) => (
              <Typography key={item.hardware.serial} variant="body2" sx={{ mb: 0.5 }}>
                • {item.hardware.name} ({item.hardware.serial})
              </Typography>
            ))}
          </Box>
        }
      >
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          {hardwares[0].hardware.name} 
          <Chip 
            label={`+${hardwares.length - 1}`} 
            size="small" 
            sx={{ ml: 0.5, height: 16, fontSize: "0.7rem" }}
          />
        </Typography>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Responsable</TableCell>
              <TableCell>Hardware</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map(() => (
              <TableRow key={crypto.randomUUID()}>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="70%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="70%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={60} height={24} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (loans.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          color: "text.secondary",
        }}
      >
        <Typography variant="body1">No se encontraron préstamos</Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: "60vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
              Responsable
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
              Hardware
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
              Fecha Inicio
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
              Fecha Fin
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
              Estado
            </TableCell>
            <TableCell
              align="center"
              sx={{ 
                fontWeight: 600, 
                bgcolor: "grey.50",
                minWidth: 150,
                width: 150
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => (
            <TableRow
              key={loan.id}
              hover
              sx={{ "&:hover": { bgcolor: "action.hover" } }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {`${loan.id_lender.names} ${loan.id_lender.surnames}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loan.id_lender.email}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                {renderHardwareList(loan.hardwares)}
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {formatDate(loan.loan_date)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {formatDate(loan.return_date)}
                </Typography>
              </TableCell>

              <TableCell>
                {getStatusChip(loan.status)}
              </TableCell>

              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      onClick={() => onViewDetails(loan)}
                      size="small"
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  {loan.status === "ABIERTO" && onAddHardware && (
                    <Tooltip title="Agregar hardware">
                      <IconButton
                        onClick={() => onAddHardware(loan)}
                        size="small"
                        color="success"
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {loan.status === "ABIERTO" && onReturnHardware && (
                    <Tooltip title="Devolver hardware">
                      <IconButton
                        onClick={() => onReturnHardware(loan)}
                        size="small"
                        color="warning"
                      >
                        <Reply />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {loan.status === "ABIERTO" && onCloseLoan && (
                    <Tooltip title="Cerrar préstamo">
                      <IconButton
                        onClick={() => onCloseLoan(loan)}
                        size="small"
                        color="error"
                      >
                        <Done />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanTable;