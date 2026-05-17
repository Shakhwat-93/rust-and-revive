// src/pages/Checkout.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, MapPin, MessageSquare, ShoppingBag,
  CheckCircle, Loader2, ChevronRight, Tag, Truck, CreditCard,
  ArrowLeft, Zap, Package,
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import { supabase } from '../lib/supabase';

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

const SHIPPING_INSIDE_DHAKA = 60;
const SHIPPING_OUTSIDE_DHAKA = 120;

const DHAKA_AREAS = [
  'Dhaka', 'Mirpur', 'Gulshan', 'Banani', 'Dhanmondi', 'Motijheel',
  'Uttara', 'Mohammadpur', 'Khilgaon', 'Rayer Bazar', 'Badda',
];

function generateOrderNumber() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RR-${now}-${rand}`;
}

/* ─── Order Summary Sidebar ─────────────────────────────────────────────── */
function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm uppercase tracking-widest text-surface-muted">
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-base-500 flex-shrink-0 border border-base-300">
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-surface-primary line-clamp-2">{item.product.name}</p>
              <p className="text-[10px] text-surface-muted mt-0.5">Size: {item.size}</p>
            </div>
            <span className="text-sm font-black text-surface-primary flex-shrink-0">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-surface-muted">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-surface-muted">
            <Truck size={13} />
            <span>Delivery</span>
          </div>
          <span className={`font-semibold ${shipping === 0 ? 'text-emerald-400' : ''}`}>
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
      </div>

      <div className="divider" />

      <div className="flex items-center justify-between">
        <span className="font-bold text-surface-primary">Total</span>
        <span className="font-black text-xl text-brand">{formatPrice(total)}</span>
      </div>

      {/* Trust badges */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex items-start gap-2.5">
        <CheckCircle size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-emerald-300 leading-relaxed">
          Cash on Delivery available. Pay when your order arrives at your door.
        </p>
      </div>
    </div>
  );
}

/* ─── Field Component ───────────────────────────────────────────────────── */
function Field({ label, icon: Icon, required, children, hint }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-surface-secondary mb-1.5">
        <Icon size={11} className="text-brand" />
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-surface-muted mt-1">{hint}</p>}
    </div>
  );
}

/* ─── Success Screen ────────────────────────────────────────────────────── */
function SuccessScreen({ orderNumber, items, total, shipping, onContinue }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-900/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-900/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6"
        >
          {/* Icon + heading */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
              className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-emerald-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase text-brand mb-2">Order Confirmed</p>
              <h1 className="font-black text-4xl sm:text-5xl text-surface-primary leading-none">
                Thank<br />you! 🔥
              </h1>
              <p className="text-surface-muted text-sm mt-3">
                Your order has been placed successfully.
              </p>
            </motion.div>
          </div>

          {/* Order number card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card p-5 border-brand/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-surface-muted font-bold mb-1">Order Number</p>
                <p className="font-mono font-black text-2xl text-brand tracking-wider">{orderNumber}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <Zap size={20} className="text-brand" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-base-300/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-surface-muted">
                <Truck size={13} />
                <span className="text-xs">Cash on Delivery</span>
              </div>
              <span className="font-black text-lg text-surface-primary">
                {formatPrice(total)}
              </span>
            </div>
          </motion.div>

          {/* Items recap */}
          {items && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="card p-4 space-y-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-surface-muted font-black">What you ordered</p>
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-11 h-12 rounded-xl overflow-hidden bg-base-500 flex-shrink-0 border border-base-300">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-surface-primary line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-surface-muted">Size {item.size} · ×{item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-surface-primary flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="card p-5"
          >
            <p className="text-[10px] uppercase tracking-widest text-surface-muted font-black mb-4">What happens next</p>
            <div className="space-y-4 relative">
              {/* Vertical line */}
              <div className="absolute left-[14px] top-3 bottom-3 w-px bg-base-300" />

              {[
                { icon: Phone,       text: 'We\'ll call to confirm your order soon.', color: 'bg-brand/20 text-brand border-brand/30' },
                { icon: Package,     text: 'Your order gets packed & dispatched.',   color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
                { icon: Truck,       text: 'Delivered in 2–4 business days.',        color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
                { icon: CheckCircle, text: 'Pay cash when your order arrives.',      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-center gap-3 relative">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 z-10 ${color}`}>
                    <Icon size={13} />
                  </div>
                  <p className="text-xs text-surface-secondary">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64 }}
            className="space-y-3"
          >
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-brand hover:bg-brand-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-glow"
            >
              Continue Shopping
              <ChevronRight size={16} />
            </motion.button>
            <p className="text-center text-[10px] text-surface-muted">
              Screenshot your order number <span className="text-brand font-mono font-bold">{orderNumber}</span> for reference.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Checkout Page ───────────────────────────────────────────────── */
export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderedItems, setOrderedItems] = useState([]);

  const isDhaka = DHAKA_AREAS.some(a =>
    form.city.toLowerCase().includes(a.toLowerCase())
  );
  const shipping = form.city.trim() === '' ? SHIPPING_OUTSIDE_DHAKA : (isDhaka ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE_DHAKA);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const total = subtotal + shipping;

  const setField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');
    setSubmitting(true);

    const num = generateOrderNumber();

    const orderPayload = {
      order_number: num,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      note: form.note.trim() || null,
      items: items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        slug: i.product.slug,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        quantity: i.quantity,
        line_total: i.product.price * i.quantity,
      })),
      subtotal,
      shipping,
      total,
      status: 'pending',
      payment_method: 'cod',
    };

    try {
      const { error: dbError } = await supabase.from('orders').insert([orderPayload]);
      if (dbError) {
        console.warn('DB insert failed:', dbError.message);
      }
      // Snapshot items BEFORE clearing cart so success screen can show them
      const orderedItems = [...items];
      setOrderNumber(num);
      clearCart();
      setOrderedItems(orderedItems);
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <SuccessScreen orderNumber={orderNumber} items={orderedItems} total={total} shipping={shipping} onContinue={() => navigate('/')} />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <ShoppingBag size={48} className="text-surface-muted mx-auto" />
          <h2 className="font-black text-2xl">Your cart is empty</h2>
          <p className="text-surface-muted text-sm">Add products before checking out.</p>
          <button onClick={() => navigate('/shop')} className="btn-primary mx-auto">
            Browse Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Subtle background glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-orange-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-site py-8 lg:py-12 relative z-10">
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-surface-muted hover:text-surface-primary text-sm font-medium transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <p className="section-label mb-1">Secure Checkout</p>
          <h1 className="font-black text-3xl sm:text-4xl text-surface-primary">Complete Your Order</h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 xl:gap-12">
          {/* ── Left: Form ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Delivery Info Card */}
              <div className="card p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/20 flex items-center justify-center">
                    <Truck size={14} className="text-brand" />
                  </div>
                  <h2 className="font-black text-base text-surface-primary">Delivery Information</h2>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                <Field label="Full Name" icon={User} required>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Arif Rahman"
                    value={form.name}
                    onChange={setField('name')}
                    className="input"
                    id="checkout-name"
                  />
                </Field>

                <Field label="Phone Number" icon={Phone} required hint="We'll call to confirm your order">
                  <input
                    required
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={setField('phone')}
                    className="input font-mono tracking-widest"
                    id="checkout-phone"
                  />
                </Field>

                <Field label="Full Address" icon={MapPin} required hint="House/flat no., road, area">
                  <textarea
                    required
                    rows={2}
                    placeholder="House 12, Road 5, Mirpur-10..."
                    value={form.address}
                    onChange={setField('address')}
                    className="input resize-none"
                    id="checkout-address"
                  />
                </Field>

                <Field label="City / District" icon={MapPin} required hint={`Dhaka inside: ৳${SHIPPING_INSIDE_DHAKA} · Outside: ৳${SHIPPING_OUTSIDE_DHAKA}`}>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Dhaka, Chittagong, Sylhet..."
                    value={form.city}
                    onChange={setField('city')}
                    list="city-suggestions"
                    className="input"
                    id="checkout-city"
                  />
                  <datalist id="city-suggestions">
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Comilla', 'Gazipur', 'Narayanganj'].map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>

                <Field label="Order Note" icon={MessageSquare}>
                  <textarea
                    rows={2}
                    placeholder="Any special instructions? (optional)"
                    value={form.note}
                    onChange={setField('note')}
                    className="input resize-none"
                    id="checkout-note"
                  />
                </Field>
              </div>

              {/* Payment Method Card */}
              <div className="card p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/20 flex items-center justify-center">
                    <CreditCard size={14} className="text-brand" />
                  </div>
                  <h2 className="font-black text-base text-surface-primary">Payment Method</h2>
                </div>

                <div className="p-4 rounded-xl border-2 border-brand/40 bg-brand/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={18} className="text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-surface-primary">Cash on Delivery</p>
                    <p className="text-[10px] text-surface-muted mt-0.5">Pay when you receive your order</p>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full border-2 border-brand flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                  </div>
                </div>
              </div>

              {/* Mobile order summary */}
              <div className="lg:hidden card p-5">
                <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={submitting || items.length === 0}
                whileHover={!submitting ? { scale: 1.015, y: -2 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl bg-brand hover:bg-brand-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Place Order · {formatPrice(total)}
                    <ChevronRight size={16} />
                  </>
                )}
              </motion.button>

              <p className="text-center text-[10px] text-surface-muted">
                By placing your order you agree to our Terms & Privacy Policy.
                Your data is secure and encrypted.
              </p>
            </form>
          </motion.div>

          {/* ── Right: Order Summary (Desktop) ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="hidden lg:block lg:col-span-2"
          >
            <div className="card p-6 sticky top-24">
              <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
