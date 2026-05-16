import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  FolderKanban, Settings, LogOut, ArrowLeft, Globe,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: FolderKanban, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden lg:flex flex-col w-64 min-h-screen border-r border-base-300 glass-dark flex-shrink-0"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-base-300">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-glow-sm">
            <img src="/logo.webp" alt="Rust Revive Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] text-surface-muted tracking-widest uppercase">Admin Panel</p>
            {user?.email && (
              <p className="text-xs text-brand font-medium truncate max-w-[130px]">{user.email}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">Main Menu</p>
        {navItems.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-all duration-200 ${
                isActive
                  ? 'text-brand bg-brand/10 shadow-[inset_0_0_0_1px_rgba(255,107,0,0.15)]'
                  : 'text-surface-secondary hover:text-surface-primary hover:bg-base-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-brand' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        <div className="divider my-4" />

        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">Website Management</p>
        <NavLink
          to="/admin/website/pages"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-all duration-200 ${
              isActive
                ? 'text-brand bg-brand/10 shadow-[inset_0_0_0_1px_rgba(255,107,0,0.15)]'
                : 'text-surface-secondary hover:text-surface-primary hover:bg-base-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Globe size={16} className={isActive ? 'text-brand' : ''} />
              Pages (Home, Shop)
            </>
          )}
        </NavLink>

        <div className="divider my-4" />

        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-surface-muted mb-3">More</p>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium text-surface-secondary hover:text-surface-primary hover:bg-base-500 transition-all duration-200">
          <Settings size={16} />
          Settings
        </button>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-base-300 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200"
        >
          <LogOut size={16} />
          Logout Admin
        </button>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium text-surface-muted hover:text-surface-primary hover:bg-base-500 transition-all duration-200"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    </motion.aside>
  );
}
