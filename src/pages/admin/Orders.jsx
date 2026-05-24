// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ShoppingBag, RefreshCw, ChevronDown, Phone, MapPin, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

function getOrderEmail(order) {
  if (order.email) return order.email;
  if (order.note && order.note.startsWith('[Email: ')) {
    const match = order.note.match(/^\[Email:\s*([^\]]+)\]/);
    if (match) return match[1];
  }
  return null;
}

function getCleanNote(note) {
  if (!note) return null;
  if (note.startsWith('[Email: ')) {
    return note.replace(/^\[Email:\s*([^\]]+)\]\s*\n?/, '');
  }
  return note;
}

const statusConfig = {
  pending:    { cls: 'badge-warning',  label: 'Pending',    next: 'processing' },
  processing: { cls: 'badge-brand',    label: 'Processing', next: 'shipped' },
  shipped:    { cls: 'badge-brand',    label: 'Shipped',    next: 'delivered' },
  delivered:  { cls: 'badge-success',  label: 'Delivered',  next: null },
  cancelled:  { cls: 'badge-danger',   label: 'Cancelled',  next: null },
};

const statusTabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* Expandable order row for desktop */
function OrderRow({ order, index, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const s = statusConfig[order.status] || statusConfig.pending;
  const items = Array.isArray(order.items) ? order.items : [];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
      onStatusChange(order.id, newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.03 }}
        className="cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        <td className="font-mono text-[10px] text-brand font-black">{order.order_number}</td>
        <td>
          <p className="font-bold text-xs text-surface-primary">{order.name}</p>
          <p className="text-[10px] text-surface-muted">{order.phone}</p>
          {getOrderEmail(order) && (
            <p className="text-[10px] text-brand/90 font-mono mt-0.5 break-all max-w-[150px]">{getOrderEmail(order)}</p>
          )}
        </td>
        <td>
          <p className="text-xs text-surface-primary">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          <p className="text-[10px] text-surface-muted line-clamp-1">{items.map(i => i.name).join(', ')}</p>
        </td>
        <td className="font-black text-xs text-brand">{formatPrice(order.total)}</td>
        <td>
          <select
            value={order.status}
            onClick={e => e.stopPropagation()}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer appearance-none bg-transparent disabled:opacity-50 ${
              order.status === 'delivered' ? 'text-emerald-400 border-emerald-500/30' :
              order.status === 'cancelled' ? 'text-red-400 border-red-500/30' :
              order.status === 'pending'   ? 'text-amber-400 border-amber-500/30' :
              'text-brand border-brand/30'
            }`}
          >
            {Object.entries(statusConfig).map(([k, v]) => (
              <option key={k} value={k} className="bg-base-600 text-surface-primary">{v.label}</option>
            ))}
          </select>
        </td>
        <td className="text-xs text-surface-secondary">{order.city}</td>
        <td className="text-[10px] text-surface-muted whitespace-nowrap">{formatDate(order.created_at)}</td>
        <td>
          <ChevronDown size={14} className={`text-surface-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </td>
      </motion.tr>

      {/* Expanded order detail */}
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={8} className="px-4 pb-4 pt-0 bg-base-500/30">
              <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-base-300/40">
                {/* Items */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted mb-2">Items Ordered</p>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        {item.image && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-base-500 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-surface-primary line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-surface-muted">Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-black text-brand flex-shrink-0">{formatPrice(item.line_total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery + Totals */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted mb-1.5">Delivery Address</p>
                      <p className="text-xs text-surface-secondary">{order.address}</p>
                      <p className="text-xs text-surface-muted">{order.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted mb-1.5">Customer Info</p>
                      <p className="text-xs text-surface-secondary">Phone: <span className="font-mono">{order.phone}</span></p>
                      {getOrderEmail(order) && (
                        <p className="text-xs text-surface-secondary mt-0.5">Email: <span className="font-mono text-brand break-all">{getOrderEmail(order)}</span></p>
                      )}
                    </div>
                  </div>
                  {getCleanNote(order.note) && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-surface-muted mb-1">Note</p>
                      <p className="text-xs text-surface-secondary italic">"{getCleanNote(order.note)}"</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-base-300/40 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-muted">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-muted">Shipping</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black">
                      <span>Total</span>
                      <span className="text-brand">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

/* Mobile order card */
function OrderCard({ order, index, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const s = statusConfig[order.status] || statusConfig.pending;
  const items = Array.isArray(order.items) ? order.items : [];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
      onStatusChange(order.id, newStatus);
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card overflow-hidden"
    >
      <div className="p-3 space-y-2.5" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-brand font-black">{order.order_number}</span>
          <div className="flex items-center gap-2">
            <span className={`badge text-[10px] ${s.cls}`}>{s.label}</span>
            <ChevronDown size={13} className={`text-surface-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-surface-primary">{order.name}</p>
            <p className="text-[10px] text-surface-muted flex items-center gap-1 mt-0.5">
              <Phone size={9} />{order.phone}
            </p>
          </div>
          <p className="text-sm font-black text-brand">{formatPrice(order.total)}</p>
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-base-300/50">
          <p className="text-[10px] text-surface-muted flex items-center gap-1">
            <MapPin size={9} />{order.city}
          </p>
          <p className="text-[10px] text-surface-muted">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-2 border-t border-base-300/50 space-y-3">
              {/* Items */}
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.image && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-base-500 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-surface-primary line-clamp-1">{item.name}</p>
                      <p className="text-[9px] text-surface-muted">Sz {item.size} · ×{item.quantity}</p>
                    </div>
                    <span className="text-[10px] font-black text-brand">{formatPrice(item.line_total)}</span>
                  </div>
                ))}
              </div>

              {getOrderEmail(order) && (
                <p className="text-[10px] text-brand/90 font-mono">Email: {getOrderEmail(order)}</p>
              )}

              {order.address && (
                <p className="text-[10px] text-surface-muted">{order.address}, {order.city}</p>
              )}

              {getCleanNote(order.note) && (
                <p className="text-[10px] text-surface-muted italic">Note: "{getCleanNote(order.note)}"</p>
              )}

              {/* Status changer */}
              <div>
                <p className="text-[10px] text-surface-muted mb-1">Change Status</p>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="input text-xs h-8 py-0 px-2"
                >
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setOrders(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.city?.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase();
    return matchSearch && matchTab;
  });

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  const tabCount = (tab) => tab === 'All'
    ? orders.length
    : orders.filter(o => o.status === tab.toLowerCase()).length;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-lg">Orders</h2>
          <p className="text-surface-muted text-xs mt-0.5">
            {loading ? 'Loading...' : `${orders.length} total · ${formatPrice(totalRevenue)} revenue`}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-muted hover:text-brand hover:bg-brand/10 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error} — Make sure the <code className="font-mono bg-red-500/10 px-1 rounded">orders</code> table exists in Supabase.
        </div>
      )}

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === tab ? 'bg-brand text-white shadow-glow-sm' : 'glass text-surface-secondary hover:text-surface-primary'
            }`}
          >
            {tab} <span className="opacity-50 font-normal ml-0.5">{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search by name, phone, order no, city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-8 text-xs h-9 w-full"
          id="orders-search"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="card py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="text-brand animate-spin" />
          <p className="text-surface-muted text-xs">Loading orders from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-16 flex flex-col items-center justify-center gap-3">
          <ShoppingBag size={28} className="text-surface-muted" />
          <p className="text-surface-muted text-xs">
            {orders.length === 0 ? 'No orders yet. Orders will appear here after customers checkout.' : 'No orders match your filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {filtered.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} onStatusChange={handleStatusChange} />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>City</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} onStatusChange={handleStatusChange} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
