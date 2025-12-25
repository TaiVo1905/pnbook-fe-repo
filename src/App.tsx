import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { routes } from '@/routes/app.routes';

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
