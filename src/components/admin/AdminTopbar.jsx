import { motion } from 'framer-motion';
import { Bell, Search, Zap, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/website/pages': 'Website Pages',
};

export default function AdminTopbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Admin';

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-4 border-b border-base-300 glass-dark"
    >
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="btn-icon lg:hidden mr-2">
        <Menu size={18} />
      </button>

      {/* Page title */}
      <h1 className="font-bold text-h4 flex-1">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="input pl-9 py-2 w-52 text-xs"
            id="admin-search"
          />
        </div>

        {/* Notifications */}
        <button className="relative btn-icon">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
          <Zap size={14} className="text-brand" />
        </div>
      </div>
    </motion.header>
  );
}
