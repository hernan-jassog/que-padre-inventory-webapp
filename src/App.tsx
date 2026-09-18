
import { AuthProvider } from './presentation/context/AuthContext';
import { AppRouter } from './presentation/routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
