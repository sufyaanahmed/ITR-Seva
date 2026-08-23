import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function DashboardLayout() {
  const { state, updateAuth } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!state.auth.isLoggedIn) {
    // Redirect to login if not logged in
    React.useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null;
  }

  const handleLogout = () => {
    updateAuth({ isLoggedIn: false, user: null });
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'e-File', path: '/dashboard/e-file' },
    { name: 'Services', path: '/dashboard/services' },
    { name: 'Pending Actions', path: '/dashboard/pending-actions' },
    { name: 'Grievances', path: '/dashboard/grievances' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-primary text-white shadow z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 no-underline text-white">
                <img src="/Emblem_of_India.svg" alt="Emblem" className="h-10" style={{ filter: 'brightness(0) invert(1)' }} />
                <span className="font-bold text-lg hidden sm:block">ITR-Seva Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm hidden md:block">
                Welcome, <span className="font-bold text-secondary">{state.auth.user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-sm font-medium hover:text-secondary transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm hidden md:block border-r border-border min-h-[calc(100vh-64px)]">
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary border-l-4 border-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Dropdown (simplified) */}
        <div className="md:hidden w-full bg-white border-b border-border p-4 mb-4">
          <select 
            className="w-full input-field font-bold text-primary"
            value={navItems.find(i => location.pathname === i.path || (i.path !== '/dashboard' && location.pathname.startsWith(i.path)))?.path || '/dashboard'}
            onChange={(e) => navigate(e.target.value)}
          >
            {navItems.map(item => (
              <option key={item.path} value={item.path}>{item.name}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
