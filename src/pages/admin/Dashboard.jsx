// src/pages/admin/Dashboard.jsx
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, Package,
  ArrowUpRight, ArrowDownRight, Eye, Star,
} from 'lucide-react';
import { products } from '../../data/products';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

const stats = [
  { label: 'Total Revenue', value: '৳4,82,500', change: '+23.5%', up: true, icon: TrendingUp, color: 'brand' },
  { label: 'Total Orders', value: '172', change: '+12.1%', up: true, icon: ShoppingBag, color: 'emerald' },
  { label: 'Customers', value: '5,248', change: '+8.3%', up: true, icon: Users, color: 'blue' },
  { label: 'Avg. Rating', value: '4.8', change: '-0.1', up: false, icon: Star, color: 'amber' },
];

const recentOrders = [
  { id: '#ORD-1091', customer: 'Arif Rahman', product: 'Rust Oversized Hoodie', size: 'L', amount: 2800, status: 'delivered', date: 'Today, 10:21 AM' },
  { id: '#ORD-1090', customer: 'Nadia Islam', product: 'Void Cargo Pants', size: '30', amount: 3200, status: 'shipped', date: 'Today, 9:14 AM' },
  { id: '#ORD-1089', customer: 'Sakib Hasan', product: 'Ember Bomber Jacket', size: 'M', amount: 5500, status: 'processing', date: 'Yesterday, 7:05 PM' },
  { id: '#ORD-1088', customer: 'Tania Momen', product: 'Revive Graphic Tee', size: 'XL', amount: 1400, status: 'delivered', date: 'Yesterday, 3:40 PM' },
  { id: '#ORD-1087', customer: 'Karim Sheikh', product: 'Night Zip Hoodie', size: 'M', amount: 3100, status: 'cancelled', date: 'May 14, 11:00 AM' },
];

const statusConfig = {
  delivered: { cls: 'badge-success', label: 'Delivered' },
  shipped: { cls: 'badge-brand', label: 'Shipped' },
  processing: { cls: 'badge-warning', label: 'Processing' },
  cancelled: { cls: 'badge-danger', label: 'Cancelled' },
};

const colorMap = {
  brand: 'bg-brand/15 text-brand border-brand/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card p-5 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[stat.color]}`}>
          <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
          {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {stat.change}
        </div>
      </div>
      <p className="font-black text-h3 text-surface-primary">{stat.value}</p>
      <p className="text-xs text-surface-muted mt-1">{stat.label}</p>
    </motion.div>
  );
}

function MiniChart({ values }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1 h-12">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
          style={{ height: `${(v / max) * 100}%`, transformOrigin: 'bottom' }}
          className={`flex-1 rounded-sm ${i === values.length - 1 ? 'bg-brand' : 'bg-base-300'}`}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const weekData = [42, 58, 38, 72, 55, 88, 65];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-bold text-h3 mb-1">Welcome back 👋</h2>
        <p className="text-surface-muted text-small">Here's what's happening with Rust Revive today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-small">Weekly Revenue</h3>
              <p className="text-xs text-surface-muted">Last 7 days</p>
            </div>
            <span className="badge-success text-xs">+23.5%</span>
          </div>

          {/* Bar Chart */}
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const val = weekData[i];
              const max = Math.max(...weekData);
              const pct = (val / max) * 100;
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-8 text-[10px] text-surface-muted text-right">{day}</span>
                  <div className="flex-1 h-6 bg-base-500 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                      className={`h-full rounded ${i === 6 ? 'bg-brand' : 'bg-base-300'}`}
                    />
                  </div>
                  <span className="w-10 text-[10px] text-surface-muted text-right">৳{val}K</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <h3 className="font-semibold text-small mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-surface-muted text-center">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-500 flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-primary line-clamp-1">{p.name}</p>
                  <p className="text-[10px] text-surface-muted">{p.reviews} reviews</p>
                </div>
                <span className="text-xs font-bold text-surface-primary flex-shrink-0">
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <h3 className="font-semibold text-small">Recent Orders</h3>
          <button className="text-xs text-brand hover:text-brand-400 transition-colors flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => {
                const status = statusConfig[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                  >
                    <td className="font-mono text-xs text-brand font-medium">{order.id}</td>
                    <td className="text-surface-primary font-medium">{order.customer}</td>
                    <td>
                      <div>
                        <p className="text-surface-primary line-clamp-1">{order.product}</p>
                        <p className="text-[10px] text-surface-muted">Size: {order.size}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-surface-primary">{formatPrice(order.amount)}</td>
                    <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                    <td className="text-surface-muted text-xs whitespace-nowrap">{order.date}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
