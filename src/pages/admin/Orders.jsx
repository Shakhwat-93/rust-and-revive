// src/pages/admin/Orders.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

const allOrders = [
  { id: '#1091', customer: 'Arif Rahman', phone: '01711-123456', product: 'Rust Oversized Hoodie', size: 'L', amount: 2800, status: 'delivered', date: '16 May', city: 'Dhaka' },
  { id: '#1090', customer: 'Nadia Islam', phone: '01812-234567', product: 'Void Cargo Pants', size: '30', amount: 3200, status: 'shipped', date: '16 May', city: 'Chittagong' },
  { id: '#1089', customer: 'Sakib Hasan', phone: '01912-345678', product: 'Ember Bomber Jacket', size: 'M', amount: 5500, status: 'processing', date: '15 May', city: 'Sylhet' },
  { id: '#1088', customer: 'Tania Momen', phone: '01611-456789', product: 'Revive Graphic Tee', size: 'XL', amount: 2800, status: 'delivered', date: '15 May', city: 'Dhaka' },
  { id: '#1087', customer: 'Karim Sheikh', phone: '01711-567890', product: 'Night Zip Hoodie', size: 'M', amount: 3100, status: 'cancelled', date: '14 May', city: 'Rajshahi' },
  { id: '#1086', customer: 'Rima Akter', phone: '01812-678901', product: 'Shadow Cargo Shorts', size: '32', amount: 2100, status: 'delivered', date: '14 May', city: 'Dhaka' },
  { id: '#1085', customer: 'Fahim Hassan', phone: '01912-789012', product: 'Rust Oversized Hoodie', size: 'XL', amount: 2800, status: 'shipped', date: '13 May', city: 'Khulna' },
  { id: '#1084', customer: 'Sumaiya Begum', phone: '01611-890123', product: 'Revive Track Jacket', size: 'S', amount: 4200, status: 'processing', date: '13 May', city: 'Dhaka' },
];

const statusConfig = {
  delivered: { cls: 'badge-success', label: 'Delivered' },
  shipped: { cls: 'badge-brand', label: 'Shipped' },
  processing: { cls: 'badge-warning', label: 'Processing' },
  cancelled: { cls: 'badge-danger', label: 'Cancelled' },
};

const statusTabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filtered = allOrders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase();
    return matchSearch && matchTab;
  });

  const totalRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h2 className="font-black text-lg">Orders</h2>
        <p className="text-surface-muted text-xs mt-0.5">{allOrders.length} total · {formatPrice(totalRevenue)} revenue</p>
      </div>

      {/* Status tabs — horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
        {statusTabs.map(tab => {
          const count = tab === 'All' ? allOrders.length : allOrders.filter(o => o.status === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === tab ? 'bg-brand text-white shadow-glow-sm' : 'glass text-surface-secondary hover:text-surface-primary'
              }`}
            >
              {tab} <span className="opacity-60 font-normal ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-8 text-xs h-9 w-full"
          id="orders-search"
        />
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2">
        {filtered.length === 0 ? (
          <div className="card py-12 flex items-center justify-center text-surface-muted text-sm">No orders found</div>
        ) : filtered.map((order, i) => {
          const s = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-brand font-black">{order.id}</span>
                <span className={`badge text-[10px] ${s.cls}`}>{s.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-surface-primary">{order.customer}</p>
                  <p className="text-[10px] text-surface-muted">{order.phone}</p>
                </div>
                <p className="text-sm font-black text-surface-primary">{formatPrice(order.amount)}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-base-300/50">
                <p className="text-[10px] text-surface-secondary">{order.product} · Sz {order.size}</p>
                <p className="text-[10px] text-surface-muted">{order.city} · {order.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>City</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const s = statusConfig[order.status];
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="font-mono text-xs text-brand font-black">{order.id}</td>
                    <td>
                      <div>
                        <p className="font-bold text-surface-primary text-xs">{order.customer}</p>
                        <p className="text-[10px] text-surface-muted">{order.phone}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-xs text-surface-primary line-clamp-1">{order.product}</p>
                      <p className="text-[10px] text-surface-muted">Sz {order.size}</p>
                    </td>
                    <td className="font-black text-surface-primary text-xs">{formatPrice(order.amount)}</td>
                    <td><span className={`badge text-[10px] ${s.cls}`}>{s.label}</span></td>
                    <td className="text-xs text-surface-secondary">{order.city}</td>
                    <td className="text-xs text-surface-muted whitespace-nowrap">{order.date}</td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-surface-muted text-xs">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
