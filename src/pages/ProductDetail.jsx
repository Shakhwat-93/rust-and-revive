import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ShoppingBag, Heart, Star, Check, ChevronDown,
  Shield, Truck, RotateCcw, Zap, ArrowRight, X, Ruler, Loader2, Layers
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../lib/api';
import { reviews } from '../data/products';
import ProductCard from '../components/shop/ProductCard';
import useCartStore from '../store/cartStore';

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [descOpen, setDescOpen] = useState(true);
  const [featOpen, setFeatOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        setProduct(prod);
        setSelectedSize(prod?.sizes?.[0] || null);

        if (prod?.category) {
          const rel = await getProducts({ category: prod.category });
          setRelatedProducts(rel.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="text-brand animate-spin" />
        <p className="text-surface-muted text-small font-mono tracking-widest uppercase">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <h1 className="text-h3 font-bold">Product Not Found</h1>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const originalPrice = product.original_price || product.originalPrice;
  const reviewsCount = product.reviews_count || product.reviews || 0;
  const rating = product.rating || 5.0;
  const longDesc = product.long_description || product.longDescription || product.description;
  const featuresList = Array.isArray(product.features) ? product.features : ['100% Premium Material', 'Custom Oversized Fit', 'Garment Washed'];

  // Enforce inventory stock control
  const inStock = product.inventory_id
    ? (product.inventory?.current_stock > 0)
    : (product.in_stock !== false);

  const productReviews = reviews.filter((r) => r.productId === product.id || r.productId === product.slug);
  const discount = originalPrice
    ? Math.round((1 - product.price / originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!inStock) return;
    if (!selectedSize && product.sizes?.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setAdding(true);
    addItem(product, selectedSize || 'One Size', 1);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        openCart();
      }, 800);
    }, 500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    if (!selectedSize && product.sizes?.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize || 'One Size', 1);
    navigate('/checkout');
  };

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image];

  // ─── Extract Size Guide Multi-Column Data ───
  const sizeGuide = product.size_guide;
  const isAdvanced = sizeGuide?.columns && sizeGuide?.rows;
  const materialText = sizeGuide?.material || "Cotton 100%";
  const cols = isAdvanced ? sizeGuide.columns : ["Size", "Dimensions"];
  const rows = isAdvanced
    ? sizeGuide.rows
    : Object.entries(sizeGuide || {}).filter(([k]) => k !== 'material').map(([sz, dim]) => ({ "Size": sz, "Dimensions": String(dim) }));

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Breadcrumb */}
      <div className="container-site py-4">
        <nav className="flex items-center gap-2 text-xs text-surface-muted">
          <Link to="/" className="hover:text-surface-primary transition-colors">Home</Link>
          <ChevronLeft size={12} className="rotate-180" />
          <Link to="/shop" className="hover:text-surface-primary transition-colors">Shop</Link>
          <ChevronLeft size={12} className="rotate-180" />
          <span className="text-surface-primary capitalize">{product.category}</span>
          <ChevronLeft size={12} className="rotate-180" />
          <span className="text-surface-secondary line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container-site py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ─── Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-base-600 aspect-square border border-base-300"
              layoutId={`product-img-${product.id}`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    product.badge === 'LIMITED' ? 'bg-brand text-white' :
                    product.badge === 'NEW DROP' ? 'bg-emerald-500 text-white' :
                    product.badge === 'SALE' ? 'bg-red-500 text-white' :
                    'bg-base-400 text-surface-primary'
                  }`}>
                    {product.badge}
                  </span>
                )}
                {discount && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    -{discount}%
                  </span>
                )}
                {!inStock && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                    STOCK OUT
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:border-red-400/50 transition-colors"
              >
                <Heart
                  size={16}
                  className={`transition-colors ${liked ? 'fill-red-400 text-red-400' : 'text-surface-secondary'}`}
                />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      activeImg === i ? 'border-brand shadow-glow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="section-label mb-2 capitalize"
              >
                {product.category}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-black text-h2 mb-3"
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(rating) ? 'fill-brand text-brand' : 'text-base-300'}
                    />
                  ))}
                </div>
                <span className="text-small text-surface-secondary">{rating} ({reviewsCount} reviews)</span>
                {inStock ? (
                  <span className="badge-success">In Stock</span>
                ) : (
                  <span className="badge-danger font-bold">Sold Out</span>
                )}
              </motion.div>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-end gap-3"
            >
              <span className="font-black text-[2rem] text-surface-primary leading-none">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-h4 text-surface-muted line-through leading-none mb-1">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="badge-brand leading-none mb-1">Save {discount}%</span>
                </>
              )}
            </motion.div>

            <div className="divider" />

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-small">Select Size</p>
                  {product.size_guide && (
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-xs font-bold text-brand hover:text-brand-400 transition-colors flex items-center gap-1.5 glass-brand px-3 py-1.5 rounded-lg"
                    >
                      <Ruler size={14} />
                      <span>Size Chart & Fit Guide</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`min-w-[48px] h-12 px-3 rounded-lg border font-semibold text-small transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-brand bg-brand text-white shadow-glow-sm'
                          : 'border-base-300 text-surface-secondary hover:border-brand/50 hover:text-surface-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {sizeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400 mt-2 font-medium"
                    >
                      Please select a size to continue
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Add to Cart & Buy Now Buttons */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart */}
              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 border-2 ${
                  !inStock
                    ? 'border-base-300 text-surface-muted bg-base-600/20 cursor-not-allowed'
                    : added
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-brand text-brand hover:bg-brand hover:text-white shadow-glow-sm'
                }`}
              >
                {!inStock ? (
                  'Stock Out'
                ) : added ? (
                  <>
                    <Check size={16} />
                    Added!
                  </>
                ) : adding ? (
                  'Adding...'
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add To Cart
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                disabled={!inStock}
                onClick={handleBuyNow}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-glow hover:shadow-glow-lg ${
                  !inStock
                    ? 'bg-base-600 text-surface-muted cursor-not-allowed border border-base-300'
                    : 'bg-brand text-white hover:bg-brand-400'
                }`}
              >
                <Zap size={16} />
                Buy Now
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Dhaka metro' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7 days' },
                { icon: Shield, label: 'Authentic', sub: '100% genuine' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass rounded-lg p-3 text-center border border-base-300">
                  <Icon size={16} className="text-brand mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-surface-primary">{label}</p>
                  <p className="text-[10px] text-surface-muted">{sub}</p>
                </div>
              ))}
            </motion.div>

            <div className="divider" />

            {/* Description Accordion */}
            <div className="space-y-2">
              {/* Description */}
              <div className="rounded-xl border border-base-300 overflow-hidden">
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-small font-semibold text-surface-primary hover:bg-base-500/50 transition-colors"
                >
                  Description
                  <ChevronDown size={16} className={`transition-transform ${descOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {descOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-small text-surface-secondary leading-relaxed whitespace-pre-line">
                        {longDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Features */}
              <div className="rounded-xl border border-base-300 overflow-hidden">
                <button
                  onClick={() => setFeatOpen(!featOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-small font-semibold text-surface-primary hover:bg-base-500/50 transition-colors"
                >
                  Features & Materials
                  <ChevronDown size={16} className={`transition-transform ${featOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {featOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <ul className="px-4 pb-4 space-y-2">
                        {featuresList.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-small text-surface-secondary">
                            <Check size={13} className="text-brand flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Reviews ─── */}
        {productReviews.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-8">
               <div>
                <p className="section-label mb-2">Reviews</p>
                <h2 className="font-bold text-h3">What people say</h2>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-brand text-brand" />
                ))}
                <span className="font-bold text-surface-primary">{rating}</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-5 border border-base-300"
                >
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={12} className="fill-brand text-brand" />
                    ))}
                  </div>
                  <p className="text-small text-surface-secondary leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                        {review.avatar}
                      </div>
                      <span className="text-xs font-semibold">{review.name}</span>
                    </div>
                    <span className="text-[10px] text-surface-muted">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2">You Might Also Like</p>
                <h2 className="font-bold text-h3">Related Products</h2>
              </div>
              <Link to={`/shop?cat=${product.category}`} className="btn-ghost hidden sm:flex items-center gap-1 group">
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Elite Multi-Column Size Guide Modal ─── */}
      <AnimatePresence>
        {sizeGuideOpen && product.size_guide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              onClick={() => setSizeGuideOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-dark rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-base-300 shadow-2xl relative z-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300/80">
                  <div className="flex items-center gap-3 text-brand font-bold">
                    <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                      <Ruler size={20} className="text-brand" />
                    </div>
                    <div>
                      <h3 className="text-h5 font-black text-surface-primary">Size Chart & Fit Guide</h3>
                      <p className="text-xs text-surface-muted font-normal">All measurements are in inches</p>
                    </div>
                  </div>
                  <button onClick={() => setSizeGuideOpen(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                {/* Material Info */}
                <div className="mb-6 p-4 rounded-2xl bg-base-900/60 border border-base-300/80 flex items-center gap-3">
                  <Layers size={18} className="text-brand flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-surface-secondary">Material / Composition</p>
                    <p className="text-sm font-bold text-surface-primary">{materialText}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-950 shadow-inner overflow-x-auto">
                  <table className="w-full text-center border-collapse font-mono text-sm">
                    <thead>
                      <tr className="border-b border-base-300 bg-base-900/80">
                        {cols.map((col, idx) => (
                          <th key={idx} className="py-3.5 px-4 text-xs font-bold text-surface-secondary uppercase tracking-wider border-r border-base-300/50 last:border-0">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300/50">
                      {rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-base-900/40 transition-colors group">
                          {cols.map((col, cIdx) => (
                            <td key={cIdx} className={`py-3.5 px-4 border-r border-base-300/50 last:border-0 ${cIdx === 0 ? 'font-bold text-brand bg-brand/5 group-hover:bg-brand/10' : 'text-surface-primary'}`}>
                              {row[col] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="w-full py-4 rounded-xl bg-brand hover:bg-brand-400 text-white font-bold text-small mt-8 shadow-glow transition-all duration-200"
                >
                  Close Size Chart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Sticky Mobile ATC & Buy Now ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 glass-dark border-t border-base-300">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {/* Info */}
          <div className="flex-1 min-w-0 pr-2">
            <p className="font-bold text-xs line-clamp-1">{product.name}</p>
            <p className="text-brand font-black text-sm mt-0.5">{formatPrice(product.price)}</p>
          </div>
          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border-2 ${
                !inStock
                  ? 'border-base-300 text-surface-muted bg-base-600/10 cursor-not-allowed'
                  : added
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-brand text-brand hover:bg-brand hover:text-white'
              }`}
            >
              {!inStock ? 'Out' : added ? 'Added' : 'Add'}
            </button>
            <button
              disabled={!inStock}
              onClick={handleBuyNow}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                !inStock
                  ? 'bg-base-600 text-surface-muted cursor-not-allowed'
                  : 'bg-brand text-white shadow-glow-sm'
              }`}
            >
              <Zap size={11} />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
