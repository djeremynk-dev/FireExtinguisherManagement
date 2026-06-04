import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Flame,
  Calendar,
  Wrench,
  FileBarChart,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/extinguishers', label: 'Extinguishers', icon: Flame },
  { to: '/inspections/schedule', label: 'Schedule Inspection', icon: Calendar },
  { to: '/inspections/history', label: 'Inspection History', icon: ClipboardCheck },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['ADMIN', 'INSPECTOR'] as const },
  { to: '/compliance', label: 'Compliance', icon: Shield },
  { to: '/reports', label: 'Reports', icon: FileBarChart, roles: ['ADMIN', 'INSPECTOR'] as const },
  { to: '/admin/users', label: 'User Management', icon: Users, roles: ['ADMIN'] as const },
  { to: '/profile', label: 'Profile', icon: UserCircle }
];

const DashboardLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.some((r) => hasRole(r))
  );

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-200">
        <div className="bg-[#A02000] p-2 rounded-lg">
          <Shield className="text-white w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-slate-900">TZW LTD</p>
          <p className="text-xs text-slate-500">Fire Safety</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {visibleNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#A02000] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 mb-1">Signed in as</p>
        <p className="text-sm font-semibold text-slate-800 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-[#A02000] font-medium">{user?.role}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-[#A02000] w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full">
        <NavContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-xl">
            <button
              type="button"
              className="absolute top-4 right-4 text-slate-500"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:px-8 sticky top-0 z-10">
          <button
            type="button"
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="lg:hidden font-bold text-[#A02000]">
            TZW LTD
          </Link>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-900">Fire Extinguisher Management</h1>
          </div>
          <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
