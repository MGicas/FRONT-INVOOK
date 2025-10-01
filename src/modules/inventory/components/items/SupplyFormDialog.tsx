import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import SupplyService from "../../service/SupplyService";
  
  interface Props {
    open: boolean;
    onClose: () => void;
    supply: any | null;
    onSave: () => void;
  }
  
  const SupplyFormDialog = ({ open, onClose, supply, onSave }: Props) => {
    const [form, setForm] = useState({
      code: "",
      name: "",
      description: "",
      count: 0,
      quantity: 0,
    });
  
    useEffect(() => {
      if (supply) {
        setForm(supply);
      } else {
        setForm({ code: "", name: "", description: "", count: 0, quantity: 0 });
      }
    }, [supply]);
  
    const handleChange = (e: any) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async () => {
      if (supply) {
        await SupplyService.update(form.code, form);
      } else {
        await SupplyService.create(form);
      }
      onSave();
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{supply ? "Editar" : "Agregar"} Consumible</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              name="code"
              label="Código"
              value={form.code}
              onChange={handleChange}
              disabled={!!supply}
            />
            <TextField
              name="name"
              label="Nombre"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              name="description"
              label="Descripción"
              value={form.description}
              onChange={handleChange}
            />
            <TextField
              name="count"
              label="Cantidad"
              type="number"
              value={form.count}
              onChange={handleChange}
            />
            <TextField
              name="quantity"
              label="Unidad"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default SupplyFormDialog;
  