import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import invookTheme from './shared/theme/invookTheme';
import Navbar from './modules/navbar/components/Navbar';
import HomePage from './modules/home/components/HomePage';
import Login from './modules/login/components/Login';
import InventoryPage from './modules/inventory/components/InventoryCards';
import EquiposPage from './modules/inventory/components/items/HardwarePage';
import ConsumiblesPage from './modules/inventory/components/items/SupplyPage';
import UserCards from './modules/users/components/UserCards';
import MonitorUser from './modules/users/components/items/MonitorUser';
import LenderUser from './modules/users/components/items/LenderUser';
import ResourceCards from './modules/resources/components/ResourceCards';
import LoanPage from './modules/resources/components/items/LoanPage';
import ConsumPage from './modules/resources/components/items/ConsumPage';

function App() {
  return (
    <ThemeProvider theme={invookTheme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/equipos" element={<EquiposPage />} />
                    <Route path="/inventory/consumibles" element={<ConsumiblesPage />} />
                    <Route path="/resources" element={<ResourceCards />} />
                    <Route path="/resources/prestamos" element={<LoanPage />} />
                    <Route path="/resources/consumos" element={<ConsumPage />} />
                    <Route path="/users" element={<UserCards />} />
                    <Route path="/users/monitor" element={<MonitorUser />} />
                    <Route path="/users/prestamistas" element={<LenderUser />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;