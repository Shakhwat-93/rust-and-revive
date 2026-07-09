// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, Zap } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import CartDrawer from './CartDrawer';
import { supabase } from '../../lib/supabase';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop', hasDropdown: true },
  { to: '/track', label: 'Track Order' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price, image')
          .ilike('name', `%${searchQuery.trim()}%`)
          .limit(5);
        if (!error && data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Real-time search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const [categories, setCategories] = useState([]);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name, slug')
          .order('name', { ascending: true });
        if (!error && data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching navbar categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-glass' : 'bg-transparent'
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <img src="/logo.webp" alt="Rust Revive Logo" className="w-full h-full object-cover" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                if (link.hasDropdown) {
                  return (
                    <div 
                      key={link.to}
                      className="relative"
                      onMouseEnter={() => setShopDropdownOpen(true)}
                      onMouseLeave={() => setShopDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                        className={`px-4 py-2 rounded-lg text-small font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                          location.pathname.startsWith('/shop')
                            ? 'text-brand bg-brand/10'
                            : 'text-surface-secondary hover:text-surface-primary hover:bg-base-500'
                        }`}
                      >
                        <span>{link.label}</span>
                        <svg 
                          width="10" 
                          height="6" 
                          viewBox="0 0 10 6" 
                          fill="none" 
                          className={`transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {shopDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-1 w-48 rounded-xl glass-dark border border-base-300/40 shadow-premium p-2 flex flex-col gap-1 z-50"
                          >
                            <Link
                              to="/shop"
                              onClick={() => setShopDropdownOpen(false)}
                              className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-surface-secondary hover:text-brand hover:bg-brand/10 transition-colors text-left"
                            >
                              All Products
                            </Link>
                            <div className="h-px bg-base-300/50 my-1" />
                            {categories.map(cat => (
                              <Link
                                key={cat.slug}
                                to={`/shop?cat=${cat.slug}`}
                                onClick={() => setShopDropdownOpen(false)}
                                className="px-4 py-2 rounded-lg text-small text-surface-secondary hover:text-brand hover:bg-brand/10 transition-colors text-left"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-small font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-brand bg-brand/10'
                          : 'text-surface-secondary hover:text-surface-primary hover:bg-base-500'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSearchOpen(true)}
                className="btn-icon" 
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative btn-icon"
                id="cart-btn"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-icon lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-dark border-t border-base-300 lg:hidden overflow-hidden"
            >
              <nav className="container-site py-4 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  if (link.hasDropdown) {
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex flex-col"
                      >
                        <button
                          onClick={() => setMobileShopOpen(!mobileShopOpen)}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-body font-medium text-left text-surface-secondary hover:text-surface-primary cursor-pointer"
                        >
                          <span>{link.label}</span>
                          <svg 
                            width="12" 
                            height="8" 
                            viewBox="0 0 12 8" 
                            fill="none" 
                            className={`transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''}`}
                          >
                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        
                        {/* Mobile Sub-menu */}
                        <AnimatePresence>
                          {mobileShopOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-6 flex flex-col gap-1 overflow-hidden"
                            >
                              <Link
                                to="/shop"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2 text-small font-semibold text-surface-secondary hover:text-brand"
                              >
                                All Products
                              </Link>
                              {categories.map(cat => (
                                <Link
                                  key={cat.slug}
                                  to={`/shop?cat=${cat.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-4 py-2 text-small text-surface-secondary hover:text-brand"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg text-body font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-brand bg-brand/10'
                              : 'text-surface-secondary hover:text-surface-primary'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  );
                })}
                <div className="divider my-2" />
                <Link to="/admin" className="px-4 py-3 text-surface-muted text-small">
                  Admin Panel →
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass-dark flex items-start justify-center pt-24 sm:pt-32 px-4"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-xl bg-base-900 border border-base-300/40 rounded-2xl shadow-premium p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute top-4 right-4 text-surface-muted hover:text-surface-primary cursor-pointer p-1 rounded-lg hover:bg-base-800 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-bold text-lg text-surface-primary mb-4">Search Products</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-muted" size={18} />
                  <input
                    type="text"
                    placeholder="Search for hoodies, cargos, tees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-11 w-full bg-base-800"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </form>

              {/* Real-time Results Dropdown */}
              {(searchQuery.trim() || searchLoading) && (
                <div className="mt-4 max-h-60 overflow-y-auto space-y-1 border-t border-base-300/30 pt-3 text-left">
                  {searchLoading && (
                    <p className="text-xs text-surface-muted animate-pulse px-2 py-1">Searching...</p>
                  )}
                  
                  {!searchLoading && searchResults.length === 0 && (
                    <p className="text-xs text-surface-muted px-2 py-1">No products found matching "{searchQuery}"</p>
                  )}

                  {!searchLoading && searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-800/80 transition-colors"
                    >
                      {prod.image && (
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-surface-primary truncate">{prod.name}</p>
                        <p className="text-xs text-brand">৳ {prod.price?.toLocaleString('en-BD')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
