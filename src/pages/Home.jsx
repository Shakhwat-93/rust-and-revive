import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Play, Zap, Star, TrendingUp, Loader2 } from 'lucide-react';
import { getProducts, getSiteSettings } from '../lib/api';
import { collections } from '../data/products';
import ProductCard from '../components/shop/ProductCard';

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

const defaultHome = {
  heroHeading: "WEAR THE STREETS.\nOWN THE MOMENT.",
  heroSubtext: "Premium streetwear for Bangladesh's next generation. Built to last. Priced for the culture.",
  heroButtonText: "Shop Now",
  heroBadge: "New Season Drop",
  heroSubBadge: "SS 2026",
  brandStoryTitle: "Born From the Streets.\nBuilt for the Future.",
  brandStoryText1: "Rust Revive was born in Dhaka out of frustration — the frustration of paying premium prices for average quality, or settling for cheap products that fall apart after one wash.",
  brandStoryText2: "We set out to prove that you don't have to choose. Premium materials, real craftsmanship, and designs that actually hit — all at prices that respect the hustle.",
  brandStoryStats: [
    { val: "400 GSM", label: "Premium Fleece" },
    { val: "100%", label: "Local Crafted" },
    { val: "0", label: "Compromise" }
  ]
};

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
function Hero({ settings }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG Image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.webp"
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
      <motion.div style={{ opacity }} className="container-site relative z-10 py-24 lg:py-32">
        <div className="max-w-6xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 glass-brand px-4 py-2 rounded-full">
              <Zap size={12} className="text-brand fill-brand" />
              <span className="text-xs font-semibold tracking-widest uppercase text-brand">
                {settings.heroBadge || defaultHome.heroBadge}
              </span>
            </div>
            <div className="flex items-center gap-1 text-surface-muted text-xs">
              <TrendingUp size={12} />
              <span>{settings.heroSubBadge || defaultHome.heroSubBadge}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-black text-[clamp(2.75rem,7vw,6rem)] leading-[1.05] tracking-tight text-glow mb-6"
          >
            {(settings.heroHeading || defaultHome.heroHeading).split('\n').map((line, idx) => (
              <span key={idx} className={line.includes('STREETS.') || idx === 0 ? 'text-white' : 'text-white'}>
                {idx > 0 && <br className="hidden sm:block" />}
                {line.includes('STREETS.') ? (
                  <>
                    {line.replace('STREETS.', '')}
                    <span className="text-brand">STREETS.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-body-lg sm:text-xl text-surface-secondary max-w-2xl mb-10 leading-relaxed whitespace-pre-line"
          >
            {settings.heroSubtext || defaultHome.heroSubtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/shop" className="btn-primary group px-8 py-4 text-base font-bold">
              {settings.heroButtonText || defaultHome.heroButtonText}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
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

/* ─── Latest Drop ───────────────────────────────────────────────────── */
function LatestDrop({ products }) {
  const newProducts = products.filter((p) => p.is_new || p.badge === 'NEW DROP' || p.badge === 'LIMITED').slice(0, 6);

  if (newProducts.length === 0) return null;

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

      <div className="pl-4 sm:pl-6 lg:pl-8 max-w-7xl mx-auto">
        <div className="scroll-snap-x gap-5 pb-4 overflow-x-auto hide-scrollbar">
          {newProducts.map((product, i) => (
            <div key={product.id} className="scroll-snap-item w-[260px] sm:w-[300px] flex-shrink-0">
              <ProductCard product={product} index={i} />
            </div>
          ))}
          <div className="scroll-snap-item w-[200px] sm:w-[220px] flex items-center flex-shrink-0">
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
function ProductGrid({ products }) {
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
function BrandStory({ settings }) {
  const stats = settings.brandStoryStats || defaultHome.brandStoryStats;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/3 to-transparent pointer-events-none" />

      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Reveal className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/5]">
              <img
                src="/images/hoodie-rust.webp"
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
              <h2 className="font-black text-h1 mb-6 leading-tight whitespace-pre-line">
                {settings.brandStoryTitle || defaultHome.brandStoryTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-surface-secondary leading-relaxed mb-6 whitespace-pre-line">
                {settings.brandStoryText1 || defaultHome.brandStoryText1}
              </p>
              <p className="text-surface-secondary leading-relaxed mb-8 whitespace-pre-line">
                {settings.brandStoryText2 || defaultHome.brandStoryText2}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="grid grid-cols-3 gap-4 mb-8">
              {stats.map(({ val, label }, i) => (
                <div key={i} className="text-center p-4 rounded-xl glass">
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
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(defaultHome);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodData, siteData] = await Promise.all([
          getProducts(),
          getSiteSettings('home_page'),
        ]);
        setProducts(prodData);
        if (siteData) {
          setSettings({ ...defaultHome, ...siteData });
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main>
      <Hero settings={settings} />
      <Collections />
      {!loading && products.length > 0 && (
        <>
          <LatestDrop products={products} />
          <ProductGrid products={products} />
        </>
      )}
      <BrandStory settings={settings} />
      <Testimonials />
    </main>
  );
}
