import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import Home from './pages/Home.jsx';
import Journey from './pages/Journey.jsx';
import Methodology from './pages/Methodology.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Navigate to="/demo/documents" replace />} />
        <Route path="/demo/:stepId" element={<Journey />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
