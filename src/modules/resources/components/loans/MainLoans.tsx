import { Box, Container, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Chip, MenuItem, Select, FormControl, InputLabel, Modal, TextField, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import LoansHeader from "./LoansHeader";
import LoansTable from "./LoansTable";
import LoansFormDialog from "./LoansFormDialog";
import { getLoans } from "../../service/getResources";
import { getLoan } from "../../service/getLoan";
import { getHardware } from "../../../inventory/service/hardware/getHardware";
import { updateLoan } from "../../service/updateLoan";
import { updateHardwareState } from "../../../inventory/service/hardware/updateHardware";
import type { Loan, HardwareItem } from "../../model/Loan";

const HARDWARE_STATES = [
  "BUENO",
  "FUNCIONAL",
  "DAÑADO",
  "PERDIDO",
  "REPARACIÓN",
];

const MainLoans = () => {
  const navigate = useNavigate();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailLoanId, setDetailLoanId] = useState<string | null>(null);
  const [detailLoan, setDetailLoan] = useState<Loan | null>(null);

  // const [selectedHardware, setSelectedHardware] = useState<string[]>([]); // no longer used
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returningHardwareSerial, setReturningHardwareSerial] = useState<string | null>(null);
  const [returnState, setReturnState] = useState<string>("BUENO");

  const [addHardwareModalOpen, setAddHardwareModalOpen] = useState(false);
  const [newHardwareSerial, setNewHardwareSerial] = useState("");
  const [addHardwareError, setAddHardwareError] = useState<string | null>(null);

  const [returnLoading, setReturnLoading] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const isSameDate = (a?: string | null, b?: string | null) => {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return da.toDateString() === db.toDateString();
  };

  const computeStatus = (loan: Loan): Loan => {
    // Si no está cerrado y la fecha inicio y fecha fin no es la misma, marcar como VENCIDO
    if (loan.status !== "CERRADO" && loan.return_date && !isSameDate(loan.loan_date, loan.return_date)) {
      return { ...loan, status: "VENCIDO" };
    }
    return loan;
  };

  // Cargar préstamos
  useEffect(() => {
    setLoading(true);
    getLoans({ page: currentPage + 1, page_size: pageSize, search: searchTerm || undefined, status: statusFilter || undefined })
      .then(res => {
        if (Array.isArray(res)) {
          const mapped = res.map(computeStatus);
          setLoans(mapped);
          setTotalCount(mapped.length);
        } else if (res.results) {
          const mapped = res.results.map(computeStatus);
          setLoans(mapped);
          setTotalCount(res.count);
        } else {
          setLoans([]);
          setTotalCount(0);
        }
        setError(null);
      })
      .catch(() => setError("Error al cargar préstamos"))
      .finally(() => setLoading(false));
  }, [currentPage, searchTerm, statusFilter]);

  // Cargar detalle de préstamo
  useEffect(() => {
    if (detailLoanId) {
      setLoading(true);
      getLoan(detailLoanId)
        .then(data => {
          setDetailLoan(computeStatus(data));
          // setSelectedHardware([]);
        })
        .catch(() => setError("Error al cargar detalle"))
        .finally(() => setLoading(false));
    } else {
      setDetailLoan(null);
      // setSelectedHardware([]);
    }
  }, [detailLoanId]);

  const handleAddNew = useCallback(() => setIsFormOpen(true), []);
  const handleFormClose = useCallback(() => setIsFormOpen(false), []);
  const handleFormSuccess = useCallback((_created?: Loan) => {
    setLoading(true);
    getLoans({ page: currentPage + 1, page_size: pageSize, search: searchTerm || undefined, status: statusFilter || undefined })
      .then(res => {
        if (Array.isArray(res)) {
          const mapped = res.map(computeStatus);
          setLoans(mapped);
          setTotalCount(mapped.length);
        } else if (res.results) {
          const mapped = res.results.map(computeStatus);
          setLoans(mapped);
          setTotalCount(res.count);
        } else {
          setLoans([]);
          setTotalCount(0);
        }
        setError(null);
      })
      .catch(() => setError("Error al cargar préstamos"))
      .finally(() => setLoading(false));
    setIsFormOpen(false);
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  const handleBack = useCallback(() => { navigate("/resources"); }, [navigate]);
  const handleSearch = useCallback((term: string) => { setSearchTerm(term); setCurrentPage(0); }, []);
  const handleClearSearch = useCallback(() => { setSearchTerm(""); setCurrentPage(0); }, []);
  const handleChangeStatus = useCallback((status: string) => { setStatusFilter(status); setCurrentPage(0); }, []);
  const handleChangePage = (_: unknown, newPage: number) => { setCurrentPage(newPage); };

  // Ver detalle
  const handleViewDetail = (loan: Loan) => setDetailLoanId(loan.id);
  const handleCloseDetail = () => setDetailLoanId(null);

  // Cerrar préstamo usando el servicio updateLoan
  const handleCloseLoan = async (loan: Loan) => {
    setLoading(true);
    try {
      const updatedLoan = await updateLoan(loan.id, { status: "CERRADO", return_date: new Date().toISOString() });
      setLoans(loans => loans.map(l => (l.id === loan.id ? computeStatus(updatedLoan) : l)));
      if (detailLoan && detailLoan.id === loan.id) {
        setDetailLoan(computeStatus(updatedLoan));
      }
      setError(null);
    } catch (err) {
      setError("No se pudo cerrar el préstamo.");
    } finally {
      setLoading(false);
    }
  };

  // Retornar hardware (solo local, deberías llamar a un servicio para actualizar el hardware en el backend)
  const handleReturnHardwareClick = (serial: string) => {
    setReturningHardwareSerial(serial);
    setReturnState("BUENO");
    setReturnModalOpen(true);
  };

  const handleReturnHardwareConfirm = async () => {
    if (detailLoan && returningHardwareSerial) {
      setReturnLoading(true);
      setReturnError(null);
      setReturnSuccess(false);
      try {
        // Actualiza el hardware en el backend
        await updateHardwareState(returningHardwareSerial, returnState);

        // Actualiza el estado local
        const updatedHardwares = detailLoan.hardwares.map(hw =>
          hw.hardware.serial === returningHardwareSerial
            ? {
                ...hw,
                returned_at: new Date().toISOString(),
                return_state: returnState,
                hardware: {
                  ...hw.hardware,
                  state: returnState,
                }
              }
            : hw
        );
        const updatedLoan: Loan = { ...detailLoan, hardwares: updatedHardwares };
        setDetailLoan(updatedLoan);
        setLoans(loans => loans.map(l => (l.id === detailLoan.id ? updatedLoan : l)));
        setReturnSuccess(true);
        // Cierra el modal después de un breve feedback
        setTimeout(() => {
          setReturnModalOpen(false);
          setReturningHardwareSerial(null);
          setReturnState("BUENO");
          setReturnSuccess(false);
        }, 1200);
      } catch (err) {
        setReturnError("No se pudo actualizar el estado del hardware.");
      } finally {
        setReturnLoading(false);
      }
    }
  };

  // Abrir modal para agregar hardware
  const handleAddHardwareClick = () => {
    setNewHardwareSerial("");
    setAddHardwareError(null);
    setAddHardwareModalOpen(true);
  };

  // Buscar hardware por serial y agregarlo al préstamo (solo local, deberías llamar a un servicio para persistir)
  const handleAddHardwareConfirm = async () => {
    if (!newHardwareSerial.trim()) {
      setAddHardwareError("Debes ingresar el serial.");
      return;
    }
    try {
      const hardwareList = await getHardware();
      const hardwareFound = hardwareList.find(hw => hw.serial === newHardwareSerial.trim());
      if (!hardwareFound) {
        setAddHardwareError("No se encontró hardware con ese serial.");
        return;
      }
      if (detailLoan) {
        // Mapeo explícito para asegurar el tipo correcto
        const newHardwareItem: HardwareItem = {
          hardware: {
            serial: hardwareFound.serial,
            name: hardwareFound.name,
            description: hardwareFound.description,
            comment: hardwareFound.comment,
            hardware_type: hardwareFound.hardware_type,
            state: hardwareFound.state,
            available: hardwareFound.available,
            hardware_type_name: hardwareFound.hardware_type_name,
            active: hardwareFound.active, // <-- asegúrate que existe
          },
          returned_at: null,
          return_state: null,
          returned_by: null,
        };
        const updatedLoan: Loan = {
          ...detailLoan,
          hardwares: [...detailLoan.hardwares, newHardwareItem],
        };
        setDetailLoan(updatedLoan);
        setLoans(loans => loans.map(l => (l.id === detailLoan.id ? updatedLoan : l)));
        setAddHardwareModalOpen(false);
        setNewHardwareSerial("");
        setAddHardwareError(null);
      }
    } catch (err) {
      setAddHardwareError("Error al buscar hardware.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "background.default", pb: 2, mb: 2 }}>
          <LoansHeader
            onBack={handleBack}
            onAddNew={handleAddNew}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            totalCount={totalCount}
            status={statusFilter}
            onChangeStatus={handleChangeStatus}
          />
        </Box>

        <Box sx={{ maxHeight: "600px", overflow: "auto", border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
          <LoansTable
            loans={loans}
            loading={loading}
            error={error}
            onViewDetail={handleViewDetail}
            onCloseLoan={(loan) => loan.status !== 'CERRADO' && handleCloseLoan(loan)}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
            labelRowsPerPage="Por página"
          />
        </Box>

        <LoansFormDialog open={isFormOpen} onClose={handleFormClose} onSuccess={handleFormSuccess} />

        {/* Dialogo de detalle */}
        <Dialog open={!!detailLoan} onClose={handleCloseDetail} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Préstamo</DialogTitle>
          <DialogContent dividers>
            {loading && <Typography>Cargando...</Typography>}
            {detailLoan && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Responsable:</strong> {detailLoan.id_lender.names} {detailLoan.id_lender.surnames} ({detailLoan.id_lender.email})
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Monitor:</strong> {detailLoan.id_monitor.first_name} {detailLoan.id_monitor.last_name} ({detailLoan.id_monitor.email})
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Estado:</strong> <Chip label={detailLoan.status} color={detailLoan.status === "ABIERTO" ? "info" : detailLoan.status === "CERRADO" ? "success" : "warning"} />
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Fecha préstamo:</strong> {detailLoan.loan_date}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Fecha devolución:</strong> {detailLoan.return_date || "-"}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Hardwares prestados:</strong>
                </Typography>
                <List>
                  {detailLoan.hardwares.map((hw, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText
                        primary={hw.hardware.name}
                        secondary={
                          <>
                            <Typography variant="body2">Serial: {hw.hardware.serial}</Typography>
                            <Typography variant="body2">Estado: {hw.hardware.state}</Typography>
                            <Typography variant="body2">
                              {hw.returned_at
                                ? `Retornado el ${new Date(hw.returned_at).toLocaleString()} (${hw.return_state})`
                                : "No retornado"}
                            </Typography>
                          </>
                        }
                      />
                      {!hw.returned_at && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ ml: 2 }}
                          onClick={() => handleReturnHardwareClick(hw.hardware.serial)}
                        >
                          Retornar
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddHardwareClick}
                  >
                    Agregar hardware por serial
                  </Button>
                </Box>
              </>
            )}
            {!loading && !detailLoan && <Typography>No se encontró información del préstamo.</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal para retornar hardware */}
        <Modal open={returnModalOpen} onClose={() => setReturnModalOpen(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 320
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Retornar hardware</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Serial:</strong> {returningHardwareSerial}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="estado-hardware-label">Estado al retornar</InputLabel>
              <Select
                labelId="estado-hardware-label"
                value={returnState}
                label="Estado al retornar"
                onChange={e => setReturnState(e.target.value)}
              >
                {HARDWARE_STATES.map(state => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" color="success" onClick={handleReturnHardwareConfirm} disabled={returnLoading}>
                {returnLoading ? "Retornando..." : "Confirmar retorno"}
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => setReturnModalOpen(false)}>
                Cancelar
              </Button>
            </Box>
            {returnSuccess && (
              <Typography color="green" variant="body2" sx={{ mt: 2 }}>
                Hardware retornado con éxito.
              </Typography>
            )}
            {returnError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {returnError}
              </Typography>
            )}
          </Box>
        </Modal>

        {/* Modal para agregar hardware por serial */}
        <Modal open={addHardwareModalOpen} onClose={() => setAddHardwareModalOpen(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 320
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Agregar hardware al préstamo</Typography>
            <Stack spacing={2}>
              <TextField
                label="Serial del hardware"
                value={newHardwareSerial}
                onChange={e => setNewHardwareSerial(e.target.value)}
                fullWidth
                autoFocus
              />
              {addHardwareError && (
                <Typography color="error" variant="body2">{addHardwareError}</Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAddHardwareConfirm}>
                  Agregar
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => setAddHardwareModalOpen(false)}>
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default MainLoans;
