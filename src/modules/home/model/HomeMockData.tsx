import { Inventory, People, TrendingUp } from "@mui/icons-material";

 export const MOCK_DATA = [
    {
      title: 'Total de Productos',
      value: '1,234',
      icon: <Inventory sx={{ fontSize: 40, color: '#2e7d32' }} />,
      change: '+12%',
    },
    {
      title: 'Usuarios Activos',
      value: '89',
      icon: <People sx={{ fontSize: 40, color: '#2e7d32' }} />,
      change: '+5%',
    },
    {
      title: 'Préstamos del Mes',
      value: '456',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#2e7d32' }} />,
      change: '+23%',
    },
  ];