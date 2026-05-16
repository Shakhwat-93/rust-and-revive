// src/pages/admin/Orders.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical } from 'lucide-react';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

const allOrders = [
  { id: '#ORD-1091', customer: 'Arif Rahman', phone: '01711-123456', product: 'Rust Oversized Hoodie', size: 'L', qty: 1, amount: 2800, status: 'delivered', date: '16 May 2026', city: 'Dhaka' },
  { id: '#ORD-1090', customer: 'Nadia Islam', phone: '01812-234567', product: 'Void Cargo Pants', size: '30', qty: 1, amount: 3200, status: 'shipped', date: '16 May 2026', city: 'Chittagong' },
  { id: '#ORD-1089', customer: 'Sakib Hasan', phone: '01912-345678', product: 'Ember Bomber Jacket', size: 'M', qty: 1, amount: 5500, status: 'processing', date: '15 May 2026', city: 'Sylhet' },
  { id: '#ORD-1088', customer: 'Tania Momen', phone: '01611-456789', product: 'Revive Graphic Tee', size: 'XL', qty: 2, amount: 2800, status: 'delivered', date: '15 May 2026', city: 'Dhaka' },
  { id: '#ORD-1087', customer: 'Karim Sheikh', phone: '01711-567890', product: 'Night Zip Hoodie', size: 'M', qty: 1, amount: 3100, status: 'cancelled', date: '14 May 2026', city: 'Rajshahi' },
  { id: '#ORD-1086', customer: 'Rima Akter', phone: '01812-678901', product: 'Shadow Cargo Shorts', size: '32', qty: 1, amount: 2100, status: 'delivered', date: '14 May 2026', city: 'Dhaka' },
  { id: '#ORD-1085', customer: 'Fahim Hassan', phone: '01912-789012', product: 'Rust Oversized Hoodie', size: 'XL', qty: 1, amount: 2800, status: 'shipped', date: '13 May 2026', city: 'Khulna' },
  { id: '#ORD-1084', customer: 'Sumaiya Begum', phone: '01611-890123', product: 'Revive Track Jacket', size: 'S', qty: 1, amount: 4200, status: 'processing', date: '13 May 2026', city: 'Dhaka' },
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-bold text-h3">Orders</h2>
        <p className="text-surface-muted text-small mt-1">{allOrders.length} total · {formatPrice(totalRevenue)} revenue</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {statusTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-small font-medium transition-all duration-200 ${activeTab === tab ? 'bg-brand text-white shadow-glow-sm' : 'glass text-surface-secondary hover:text-surface-primary'}`}>
            {tab} <span className="ml-1 text-[10px] opacity-60">{tab === 'All' ? allOrders.length : allOrders.filter(o => o.status === tab.toLowerCase()).length}</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" id="orders-search" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>City</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map((order, i) => {
                const status = statusConfig[order.status];
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="font-mono text-xs text-brand font-bold">{order.id}</td>
                    <td><div><p className="font-semibold text-surface-primary">{order.customer}</p><p className="text-[10px] text-surface-muted">{order.phone}</p></div></td>
                    <td><div><p className="text-surface-primary line-clamp-1">{order.product}</p><p className="text-[10px] text-surface-muted">Size: {order.size}</p></div></td>
                    <td className="font-bold text-surface-primary">{formatPrice(order.amount)}</td>
                    <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                    <td className="text-surface-secondary">{order.city}</td>
                    <td className="text-surface-muted text-xs">{order.date}</td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-surface-muted">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
