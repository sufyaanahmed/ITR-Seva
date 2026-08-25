import { Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import Home from './pages/Home.jsx';
import DemoSelector from './pages/DemoSelector.jsx';
import Methodology from './pages/Methodology.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';
import { LegacyDemoRedirect, ProfileJourneyRoute } from './components/DemoRouteGuards.jsx';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoSelector />} />
        <Route path="/demo/:profileId/:stepId" element={<ProfileJourneyRoute />} />
        <Route path="/demo/:stepId" element={<LegacyDemoRedirect />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
