
import AppProviders from './shared/providers/AppProviders';
import AppRoutes from './shared/routes/AppRoutes';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
