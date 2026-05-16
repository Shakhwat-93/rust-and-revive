// src/pages/Home.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Play, Zap, Star, TrendingUp } from 'lucide-react';
import { products, collections } from '../data/products';
import ProductCard from '../components/shop/ProductCard';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

/* ─── Scroll Reveal Wrapper ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG Image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.png"
          alt="Rust Revive Hero"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-base-900/60 via-base-900/40 to-base-800" />
        {/* Orange glow center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial-brand opacity-40" />
      </motion.div>

      {/* Floating noise */}
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-40" />

      {/* Content */}
      <motion.div style={{ opacity }} className="container-site relative z-10 pt-24">
        <div className="max-w-4xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 glass-brand px-4 py-2 rounded-full">
              <Zap size={12} className="text-brand fill-brand" />
              <span className="text-xs font-semibold tracking-widest uppercase text-brand">New Season Drop</span>
            </div>
            <div className="flex items-center gap-1 text-surface-muted text-xs">
              <TrendingUp size={12} />
              <span>SS 2026</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-black text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight text-glow mb-6"
          >
            WEAR THE
            <br />
            <span className="text-brand">STREETS.</span>
            <br />
            OWN THE
            <br />
            MOMENT.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-body-lg text-surface-secondary max-w-lg mb-10 leading-relaxed"
          >
            Premium streetwear for Bangladesh's next generation.
            Built to last. Priced for the culture.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/shop" className="btn-primary group">
              Shop Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-ghost flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center group-hover:border-brand/40 transition-colors">
                <Play size={10} className="text-surface-primary fill-surface-primary ml-0.5" />
              </div>
              Watch the drop
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-8 mt-16"
          >
            {[
              { val: '5K+', label: 'Happy Customers' },
              { val: '4.9', label: 'Avg Rating', icon: Star },
              { val: '48h', label: 'Dhaka Delivery' },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} className="text-center sm:text-left">
                <div className="flex items-center gap-1">
                  <span className="font-black text-h3 text-surface-primary">{val}</span>
                  {Icon && <Icon size={14} className="text-brand fill-brand" />}
                </div>
                <p className="text-xs text-surface-muted">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest uppercase text-surface-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-brand to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ─── Collections ────────────────────────────────────────────────────── */
function Collections() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Categories</p>
            <h2 className="font-bold text-h2">Shop by Collection</h2>
          </div>
          <Link to="/shop" className="btn-ghost hidden sm:flex items-center gap-1 group">
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col, i) => (
            <Reveal key={col.id} delay={i * 0.1}>
              <Link
                to={`/shop?cat=${col.id}`}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] block bg-base-600"
              >
                <motion.img
                  src={col.image}
                  alt={col.label}
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-900/90 via-base-900/20 to-transparent" />
                {/* Hover glow */}
                <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-bold text-surface-primary">{col.label}</p>
                  <p className="text-xs text-surface-muted">{col.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-brand text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Latest Drop (Horizontal Scroll) ───────────────────────────────── */
function LatestDrop() {
  const newProducts = products.filter(p => p.new || p.badge === 'NEW DROP' || p.badge === 'LIMITED');

  return (
    <section className="py-12 lg:py-16 overflow-hidden">
      <div className="container-site mb-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="section-label mb-2">New Arrivals</p>
            <h2 className="font-bold text-h2">Latest Drop</h2>
          </div>
          <Link to="/shop" className="btn-ghost hidden sm:flex items-center gap-1 group">
            All Products
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>

      {/* Horizontal scroll */}
      <div className="pl-4 sm:pl-6 lg:pl-8 max-w-7xl mx-auto">
        <div className="scroll-snap-x gap-5 pb-4">
          {newProducts.map((product, i) => (
            <div key={product.id} className="scroll-snap-item w-[260px] sm:w-[300px]">
              <ProductCard product={product} index={i} />
            </div>
          ))}
          {/* View all card */}
          <div className="scroll-snap-item w-[200px] sm:w-[220px] flex items-center">
            <Link
              to="/shop"
              className="w-full aspect-[3/4] rounded-xl glass-brand flex flex-col items-center justify-center gap-3 group hover:bg-brand/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center group-hover:bg-brand/30 transition-colors">
                <ArrowRight size={20} className="text-brand group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-small font-semibold text-brand">View All</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Product Grid ───────────────────────────────────────────────────── */
function ProductGrid() {
  const featured = products.slice(0, 4);

  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="text-center mb-12">
          <p className="section-label mb-3">The Catalog</p>
          <h2 className="font-bold text-h2 mb-4">Most Wanted</h2>
          <p className="text-surface-secondary max-w-md mx-auto">
            Hand-picked bestsellers. Each piece designed to outlast trends.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <Reveal delay={0.2} className="text-center mt-12">
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2 group">
            Browse Full Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Brand Story ────────────────────────────────────────────────────── */
function BrandStory() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/3 to-transparent pointer-events-none" />

      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Reveal className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/5]">
              <img
                src="/images/hoodie-rust.png"
                alt="Rust Revive Brand Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand/15 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -right-5 lg:bottom-8 lg:right-8 glass-brand rounded-2xl px-6 py-4 shadow-glass"
            >
              <div className="flex items-center gap-2 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-brand text-brand" />
                ))}
              </div>
              <p className="text-small font-bold">5,000+ Happy Customers</p>
              <p className="text-xs text-surface-muted">Across Bangladesh</p>
            </motion.div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <p className="section-label mb-4">Our Story</p>
              <h2 className="font-black text-h1 mb-6 leading-tight">
                Born From the
                <span className="text-brand"> Streets.</span>
                <br />Built for the Future.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-surface-secondary leading-relaxed mb-6">
                Rust Revive was born in Dhaka out of frustration — the frustration of paying premium prices for average quality, or settling for cheap products that fall apart after one wash.
              </p>
              <p className="text-surface-secondary leading-relaxed mb-8">
                We set out to prove that you don't have to choose. Premium materials, real craftsmanship, and designs that actually hit — all at prices that respect the hustle.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: '400 GSM', label: 'Premium Fleece' },
                { val: '100%', label: 'Local Crafted' },
                { val: '0', label: 'Compromise' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center p-4 rounded-xl glass">
                  <p className="font-black text-h4 text-brand">{val}</p>
                  <p className="text-xs text-surface-muted mt-1">{label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.3}>
              <Link to="/shop" className="btn-primary group inline-flex items-center gap-2">
                Shop the Vision
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Marquee Banner ─────────────────────────────────────────────────── */
function MarqueeBanner() {
  const items = ['RUST REVIVE', 'NEW DROP', 'STREETWEAR', 'DHAKA', 'SS 2026', 'PREMIUM QUALITY'];

  return (
    <div className="py-5 border-y border-base-300 overflow-hidden">
      <motion.div
        animate={{ x: '-50%' }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-4 text-xs font-bold tracking-widest uppercase text-surface-muted">
            {item}
            <span className="text-brand">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: 'Arif R.', city: 'Dhaka', rating: 5, text: 'Best quality hoodie I\'ve found in BD. The rust color is insane IRL. Already ordered my second one.' },
    { name: 'Nadia I.', city: 'Chittagong', rating: 5, text: 'Fast delivery, premium packaging. Feels like ordering from a global brand but local. Love the brand story.' },
    { name: 'Sakib H.', city: 'Sylhet', rating: 5, text: 'The cargo pants are elite. 6 deep pockets, quality stitching, perfect fit. Worth every taka.' },
    { name: 'Tania M.', city: 'Dhaka', rating: 5, text: 'The graphic tee quality blew me away. Heavyweight cotton, great print. I\'ve washed it 10+ times and it\'s still perfect.' },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="text-center mb-12">
          <p className="section-label mb-3">Social Proof</p>
          <h2 className="font-bold text-h2">The Streets Don't Lie</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08}>
              <div className="glass rounded-xl p-5 h-full card-hover">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={12} className="fill-brand text-brand" />
                  ))}
                </div>
                <p className="text-small text-surface-secondary leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-primary">{review.name}</p>
                    <p className="text-[10px] text-surface-muted">{review.city}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ──────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeBanner />
      <Collections />
      <LatestDrop />
      <ProductGrid />
      <BrandStory />
      <Testimonials />
    </main>
  );
}
