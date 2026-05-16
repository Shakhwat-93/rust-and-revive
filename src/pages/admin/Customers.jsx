// src/pages/admin/Customers.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

const customers = [
  { id: 1, name: 'Arif Rahman', email: 'arif@email.com', phone: '01711-123456', city: 'Dhaka', orders: 5, totalSpent: 14800, lastOrder: '16 May 2026', status: 'vip' },
  { id: 2, name: 'Nadia Islam', email: 'nadia@email.com', phone: '01812-234567', city: 'Chittagong', orders: 3, totalSpent: 8700, lastOrder: '16 May 2026', status: 'regular' },
  { id: 3, name: 'Sakib Hasan', email: 'sakib@email.com', phone: '01912-345678', city: 'Sylhet', orders: 2, totalSpent: 7300, lastOrder: '15 May 2026', status: 'regular' },
  { id: 4, name: 'Tania Momen', email: 'tania@email.com', phone: '01611-456789', city: 'Dhaka', orders: 7, totalSpent: 21500, lastOrder: '15 May 2026', status: 'vip' },
  { id: 5, name: 'Karim Sheikh', email: 'karim@email.com', phone: '01711-567890', city: 'Rajshahi', orders: 1, totalSpent: 3100, lastOrder: '14 May 2026', status: 'new' },
  { id: 6, name: 'Rima Akter', email: 'rima@email.com', phone: '01812-678901', city: 'Dhaka', orders: 4, totalSpent: 11200, lastOrder: '14 May 2026', status: 'regular' },
  { id: 7, name: 'Fahim Hassan', email: 'fahim@email.com', phone: '01912-789012', city: 'Khulna', orders: 2, totalSpent: 5600, lastOrder: '13 May 2026', status: 'new' },
  { id: 8, name: 'Sumaiya Begum', email: 'sumaiya@email.com', phone: '01611-890123', city: 'Dhaka', orders: 6, totalSpent: 18400, lastOrder: '13 May 2026', status: 'vip' },
];

const statusConfig = {
  vip: { cls: 'badge-brand', label: 'VIP' },
  regular: { cls: 'badge-success', label: 'Regular' },
  new: { cls: 'badge-warning', label: 'New' },
};

export default function AdminCustomers() {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;
  const vipCount = customers.filter(c => c.status === 'vip').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-bold text-h3">Customers</h2>
        <p className="text-surface-muted text-small mt-1">{totalCustomers} total · {vipCount} VIP</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, color: 'text-surface-primary' },
          { label: 'VIP Customers', value: vipCount, color: 'text-brand' },
          { label: 'Avg. Orders', value: (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1), color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className={`font-black text-h3 ${color}`}>{value}</p>
            <p className="text-xs text-surface-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" id="customers-search" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Customer</th><th>Contact</th><th>City</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Last Order</th></tr></thead>
            <tbody>
              {filtered.map((customer, i) => {
                const status = statusConfig[customer.status];
                const initials = customer.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/20 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">{initials}</div>
                        <p className="font-semibold text-surface-primary">{customer.name}</p>
                      </div>
                    </td>
                    <td><div><p className="text-surface-secondary text-xs">{customer.email}</p><p className="text-[10px] text-surface-muted">{customer.phone}</p></div></td>
                    <td className="text-surface-secondary">{customer.city}</td>
                    <td className="font-semibold text-surface-primary text-center">{customer.orders}</td>
                    <td className="font-bold text-surface-primary">{formatPrice(customer.totalSpent)}</td>
                    <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                    <td className="text-surface-muted text-xs">{customer.lastOrder}</td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-surface-muted">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
