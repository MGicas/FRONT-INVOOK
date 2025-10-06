import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from '../modules/routes/ProtectedRoutes';
import { useAuth } from '../hooks/useAuth';
import Login from '../../modules/login/components/Login';
import Navbar from '../navbar/components/Navbar';
import HomePage from '../../modules/home/components/HomePage';
import MainInventory from '../../modules/inventory/components/MainInventory';
import MainHardware from '../../modules/inventory/components/hardware/MainHardware';
import MainSupply from '../../modules/inventory/components/supply/MainSupply';
import MainUsers from '../../modules/users/components/MainUsers';
import MainMonitor from '../../modules/users/components/monitors/MainMonitor';
import MainLender from '../../modules/users/components/lenders/MainLender';


const TemporaryPage = ({ title }: { title: string }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>Esta es una página temporal. Aquí irá el componente {title}.</p>
  </div>
);

export default function AppRoutes() {
  const { isAuthenticated } = useAuth(); 

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/home" replace />
            )
          } 
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <Navigate to="/home" replace />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/home"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <HomePage />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainInventory />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/inventory/equipos"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainHardware />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/inventory/consumibles"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainSupply  />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/resources"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <TemporaryPage title="Resources" />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/resources/prestamos"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <TemporaryPage title="Préstamos" />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/resources/consumos"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <TemporaryPage title="Consumos" />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/users"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainUsers />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/users/monitors"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainMonitor />
              </main>
            </ProtectedRoutes>
          }
        />
        
        <Route
          path="/users/prestamistas"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navbar />
              <main style={{ flex: 1, padding: '1rem' }}>
                <MainLender />
              </main>
            </ProtectedRoutes>
          }
        />
        <Route 
          path="*" 
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Navigate to="/home" replace />
            </ProtectedRoutes>
          } 
        />
      </Routes>
    </div>
  );
}