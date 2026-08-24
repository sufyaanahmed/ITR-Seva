import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { COPY } from '../data/copy.js';

export default function AppShell({ children }) {
  const { demo } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const copy = COPY[demo.language];

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="prototype-bar" role="note">{copy.independent}</div>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="KarSaathi home">
            <span className="brand-mark" aria-hidden="true">KS</span>
            <span className="brand-copy">KarSaathi<small>{copy.tagline}</small></span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link to="/">{copy.home}</Link>
            <Link to="/methodology">{copy.how}</Link>
          </nav>
          <select
            className="mobile-nav"
            aria-label="Navigation"
            value={location.pathname.startsWith('/demo') ? '/demo/documents' : location.pathname}
            onChange={(event) => navigate(event.target.value)}
          >
            <option value="/">{copy.home}</option>
            <option value="/demo/documents">Demo</option>
            <option value="/methodology">{copy.how}</option>
            <option value="/privacy">{copy.privacy}</option>
          </select>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>KarSaathi</strong>
            <p className="fine-print">Built with fictional data for Build What Moves India 2026.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/methodology">{copy.how}</Link>
            <Link to="/privacy">{copy.privacy}</Link>
            <a href="https://www.incometax.gov.in/" target="_blank" rel="noreferrer">Official e-Filing portal ↗</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
