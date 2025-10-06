import { type ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import invookTheme from '../theme/invookTheme';
import { AuthProvider } from '../context/AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <ThemeProvider theme={invookTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          {children}
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}