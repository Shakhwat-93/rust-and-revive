// src/pages/TrackOrder.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, MapPin, Truck, CheckCircle2, AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim() && !phone.trim()) {
      setError('Please enter either an Order ID or Phone Number.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      let query = supabase.from('orders').select('*');

      if (orderId.trim() && phone.trim()) {
        query = query.eq('id', orderId.trim()).eq('phone', phone.trim());
      } else if (orderId.trim()) {
        query = query.eq('id', orderId.trim());
      } else {
        query = query.eq('phone', phone.trim());
      }

      // Fetch the latest matching order (ordered by created_at desc)
      const { data, error: dbError } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        setError('No order found with the provided details. Please check and try again.');
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to fetch order status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get status details and step progression
  const getStatusProgress = (status = '') => {
    const normalized = status.toLowerCase();

    // Steps: 1: Placed, 2: Confirmed, 3: Shipped, 4: Delivered
    if (['cancelled', 'fake order', 'returned'].includes(normalized)) {
      return { step: -1, label: 'Cancelled / Returned', description: 'This order has been cancelled or returned. Please contact support if you believe this is an error.' };
    }
    if (['delivered'].includes(normalized)) {
      return { step: 4, label: 'Delivered', description: 'Delivered successfully! Thank you for shopping with Rust Revive.' };
    }
    if (['dispatched', 'shipped', 'bulk exported', 'courier submitted'].includes(normalized)) {
      return { step: 3, label: 'Shipped & Out for Delivery', description: 'Your package is on its way. Tracker ID: ' + (order?.tracking_id || 'Generating...') };
    }
    if (['confirmed'].includes(normalized)) {
      return { step: 2, label: 'Order Confirmed', description: 'Your order has been verified and is currently being packed in our factory.' };
    }
    // Default 'new', 'pending call', 'final call pending'
    return { step: 1, label: 'Order Placed', description: 'We have received your order. A team member will call you shortly to confirm.' };
  };

  const statusInfo = order ? getStatusProgress(order.status) : null;

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      {/* Background glow decorations */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-orange-950/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-site relative z-10 max-w-3xl">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <p className="section-label mb-2">Order Tracking</p>
          <h1 className="font-black text-3xl sm:text-4xl text-surface-primary">Track Your Package</h1>
          <p className="text-surface-secondary text-sm sm:text-base mt-2 max-w-md mx-auto">
            Enter your Order ID (from your confirmation message) or Phone Number to check real-time status.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="glass-dark p-6 sm:p-8 rounded-xl shadow-glass mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderId" className="block text-xs font-bold text-surface-secondary mb-2 uppercase tracking-wider">
                  Order ID / Number
                </label>
                <div className="relative">
                  <ClipboardList size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-muted" />
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. REV-10023"
                    className="input pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-surface-secondary mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-sm flex gap-2 items-start"
              >
                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Searching Order...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time Order Results */}
        <AnimatePresence mode="wait">
          {order && statusInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Header Card */}
              <div className="glass-dark p-6 rounded-xl border border-brand/10 shadow-glass">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-brand px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20">
                      {order.status}
                    </span>
                    <h2 className="font-black text-xl sm:text-2xl mt-3 text-surface-primary">
                      {statusInfo.label}
                    </h2>
                    <p className="text-surface-secondary text-sm mt-1">
                      {statusInfo.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-surface-muted text-xs">Total Amount</p>
                    <p className="text-xl font-black text-brand">৳ {order.amount?.toLocaleString()}</p>
                    <p className="text-surface-muted text-[10px] mt-0.5">Order ID: {order.id}</p>
                  </div>
                </div>

                {/* Progress bar timeline */}
                {statusInfo.step > 0 && (
                  <div className="mt-8 pt-4 border-t border-base-800">
                    <div className="relative flex justify-between items-center max-w-md mx-auto">
                      {/* Connection Lines */}
                      <div className="absolute left-0 right-0 h-1 bg-base-800 -z-10" />
                      <div
                        className="absolute left-0 h-1 bg-brand -z-10 transition-all duration-500"
                        style={{ width: `${((statusInfo.step - 1) / 3) * 100}%` }}
                      />

                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          statusInfo.step >= 1 ? 'bg-brand text-white shadow-glow-sm' : 'bg-base-800 text-surface-muted'
                        }`}>
                          <ClipboardList size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-surface-secondary mt-2">Placed</span>
                      </div>

                      {/* Step 2: Confirmed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          statusInfo.step >= 2 ? 'bg-brand text-white shadow-glow-sm' : 'bg-base-800 text-surface-muted'
                        }`}>
                          <Package size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-surface-secondary mt-2">Confirmed</span>
                      </div>

                      {/* Step 3: Shipped */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          statusInfo.step >= 3 ? 'bg-brand text-white shadow-glow-sm' : 'bg-base-800 text-surface-muted'
                        }`}>
                          <Truck size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-surface-secondary mt-2">Shipped</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          statusInfo.step >= 4 ? 'bg-brand text-white shadow-glow-sm' : 'bg-base-800 text-surface-muted'
                        }`}>
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-surface-secondary mt-2">Delivered</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary & Logistics Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Items Summary Card */}
                <div className="glass-dark p-6 rounded-xl space-y-4">
                  <h3 className="font-bold text-sm text-surface-secondary uppercase tracking-wider border-b border-base-800 pb-2">
                    Ordered Items
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {order.ordered_items && order.ordered_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          )}
                          <div>
                            <p className="font-bold text-surface-primary line-clamp-1">{item.name}</p>
                            <p className="text-surface-muted text-xs">Size: {item.size || 'N/A'} × {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-surface-primary">৳ {item.line_total?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics & Delivery Details */}
                <div className="glass-dark p-6 rounded-xl space-y-4">
                  <h3 className="font-bold text-sm text-surface-secondary uppercase tracking-wider border-b border-base-800 pb-2">
                    Delivery Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3 items-start">
                      <MapPin size={16} className="text-brand flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-surface-muted text-xs">Delivery Address</p>
                        <p className="font-medium text-surface-primary mt-0.5">{order.address}</p>
                        <p className="text-surface-secondary text-xs mt-1">Recipient: {order.customer_name} ({order.phone})</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Truck size={16} className="text-brand flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-surface-muted text-xs">Courier Details</p>
                        <p className="font-medium text-surface-primary mt-0.5">
                          {order.courier_name ? `${order.courier_name} (${order.courier_status})` : 'Awaiting courier assignment'}
                        </p>
                        {order.tracking_id && (
                          <p className="text-surface-secondary text-xs mt-0.5">Waybill: {order.tracking_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
