import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Zap, Star, TrendingUp, Loader2, Heart, MessageCircle, Sparkles, ExternalLink } from 'lucide-react';
import { getProducts, getSiteSettings, getCategories } from '../lib/api';
import { collections } from '../data/products';
import ProductCard from '../components/shop/ProductCard';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

const defaultHome = {
  heroBgImage: "/images/hero-banner.webp",
  heroBadge: "New Season Drop",
  heroSubBadge: "SS 2026",
  heroHeading: "WEAR THE STREETS.\nOWN THE MOMENT.",
  heroSubtext: "Premium streetwear for Bangladesh's next generation. Built to last. Priced for the culture.",
  heroButtonText: "Shop Now",

  collectionsLabel: "Categories",
  collectionsTitle: "Shop by Collection",

  latestLabel: "New Arrivals",
  latestTitle: "Latest Drop",

  catalogLabel: "The Catalog",
  catalogTitle: "Most Wanted",
  catalogSubtext: "Hand-picked bestsellers. Each piece designed to outlast trends.",

  brandStoryLabel: "Our Story",
  brandStoryImage: "/images/hoodie-rust.webp",
  brandStoryTitle: "Born From the Streets.\nBuilt for the Future.",
  brandStoryText1: "Rust Revive was born in Dhaka out of frustration — the frustration of paying premium prices for average quality, or settling for cheap products that fall apart after one wash.",
  brandStoryText2: "We set out to prove that you don't have to choose. Premium materials, real craftsmanship, and designs that actually hit — all at prices that respect the hustle.",
  brandStoryStats: [
    { val: "400 GSM", label: "Premium Fleece" },
    { val: "100%", label: "Local Crafted" },
    { val: "0", label: "Compromise" }
  ],

  instagramLabel: "Join The Culture",
  instagramTitle: "Follow @rust.revive",
  instagramSubtext: "Tag us in your street fits to get featured on our official channel.",
  instagramUrl: "https://www.instagram.com/rust.revive?igsh=MWl3Y3N0MmM0MGRhMQ%3D%3D&utm_source=qr",
  instagramProfileImage: "/images/hoodie-rust.webp",
  instagramImages: [
    { src: "/images/hoodie-rust.webp", likes: "1.2k", comments: "84" },
    { src: "/images/hoodie-black.webp", likes: "956", comments: "42" },
    { src: "/images/tee-charcoal.webp", likes: "2.4k", comments: "128" },
    { src: "/images/cargo-black.webp", likes: "1.8k", comments: "96" },
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
          src={settings.heroBgImage || defaultHome.heroBgImage}
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
function Collections({ settings, categories }) {
  const list = categories && categories.length > 0 
    ? categories.map(cat => ({
        id: cat.slug,
        label: cat.name,
        desc: cat.description,
        image: cat.image_url || '/images/hoodie-rust.webp'
      }))
    : [
        { id: 'hoodies', label: 'Hoodies', desc: 'Heavy & Oversized', image: '/images/hoodie-rust.webp' },
        { id: 'bottoms', label: 'Bottoms', desc: 'Utility & Street', image: '/images/cargo-black.webp' },
        { id: 'jackets', label: 'Jackets', desc: 'Layer Up', image: '/images/jacket-bomber.webp' },
        { id: 'tees', label: 'Tees', desc: 'The Essential', image: '/images/tee-charcoal.webp' }
      ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">{settings.collectionsLabel || defaultHome.collectionsLabel}</p>
            <h2 className="font-bold text-h2">{settings.collectionsTitle || defaultHome.collectionsTitle}</h2>
          </div>
          <Link to="/shop" className="btn-ghost hidden sm:flex items-center gap-1 group">
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((col, i) => (
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
function LatestDrop({ products, settings }) {
  const newProducts = products.filter((p) => p.is_new || p.badge === 'NEW DROP' || p.badge === 'LIMITED').slice(0, 6);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 overflow-hidden">
      <div className="container-site mb-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="section-label mb-2">{settings.latestLabel || defaultHome.latestLabel}</p>
            <h2 className="font-bold text-h2">{settings.latestTitle || defaultHome.latestTitle}</h2>
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
function ProductGrid({ products, settings }) {
  const featured = products.slice(0, 4);

  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="text-center mb-12">
          <p className="section-label mb-3">{settings.catalogLabel || defaultHome.catalogLabel}</p>
          <h2 className="font-bold text-h2 mb-4">{settings.catalogTitle || defaultHome.catalogTitle}</h2>
          <p className="text-surface-secondary max-w-md mx-auto whitespace-pre-line">
            {settings.catalogSubtext || defaultHome.catalogSubtext}
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
                src={settings.brandStoryImage || defaultHome.brandStoryImage}
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
              <p className="section-label mb-4">{settings.brandStoryLabel || defaultHome.brandStoryLabel}</p>
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

/* ─── Instagram / Community Section ────────────────────────────────── */
function InstagramSection({ settings }) {
  const instaUrl = settings.instagramUrl || defaultHome.instagramUrl;
  const profileImg = settings.instagramProfileImage || defaultHome.instagramProfileImage;
  const feedImages = settings.instagramImages && settings.instagramImages.length === 4
    ? settings.instagramImages
    : defaultHome.instagramImages;

  return (
    <section className="py-24 lg:py-32 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-brand/5 via-transparent to-transparent pointer-events-none" />

      <div className="container-site relative z-10">
        <Reveal className="text-center mb-12">
          <p className="section-label mb-3">{settings.instagramLabel || defaultHome.instagramLabel}</p>
          <h2 className="font-bold text-h2 mb-4">{settings.instagramTitle || defaultHome.instagramTitle}</h2>
          <p className="text-surface-secondary max-w-md mx-auto">
            {settings.instagramSubtext || defaultHome.instagramSubtext}
          </p>
        </Reveal>

        {/* Big Social Card */}
        <Reveal delay={0.2} className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl overflow-hidden border border-base-300 shadow-glass-lg group relative bg-base-900/60 backdrop-blur-xl p-6 sm:p-8">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-base-300/80">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-0.5 flex-shrink-0">
                  <div className="w-full h-full bg-base-900 rounded-full flex items-center justify-center p-1 overflow-hidden">
                    <img src={profileImg} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-surface-primary">rust.revive</h3>
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  </div>
                  <p className="text-xs text-surface-muted">Streetwear Brand • Bangladesh</p>
                </div>
              </div>

              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand hover:bg-brand-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-glow transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <InstagramIcon size={18} />
                <span>Follow Official</span>
              </a>
            </div>

            {/* Grid of Feed */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {feedImages.map((img, idx) => (
                <a
                  key={idx}
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-2xl overflow-hidden group/item bg-base-800 block shadow-md border border-base-300/40"
                >
                  <img src={img.src} alt="Instagram post" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500 ease-out" />
                  <div className="absolute inset-0 bg-base-950/70 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Heart size={16} className="fill-white text-white" />
                      <span>{img.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <MessageCircle size={16} className="fill-white text-white" />
                      <span>{img.comments}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom Footer CTA inside card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-base-300/50">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-brand flex-shrink-0" />
                <span className="text-xs text-surface-secondary font-medium">Join 5,000+ streetwear enthusiasts across Bangladesh</span>
              </div>
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs text-brand font-bold inline-flex items-center gap-1 group/btn"
              >
                <span>Explore Instagram Feed</span>
                <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Home Page ──────────────────────────────────────────────────────── */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(defaultHome);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodData, catData, siteData] = await Promise.all([
          getProducts(),
          getCategories(),
          getSiteSettings('home_page'),
        ]);
        setProducts(prodData);
        setCategories(catData || []);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-800">
        <Loader2 size={40} className="text-brand animate-spin" />
        <p className="text-surface-secondary text-xs font-mono tracking-widest uppercase animate-pulse">Loading Storefront...</p>
      </div>
    );
  }

  return (
    <main>
      <Hero settings={settings} />
      <Collections settings={settings} categories={categories} />
      {products.length > 0 && (
        <>
          <LatestDrop products={products} settings={settings} />
          <ProductGrid products={products} settings={settings} />
        </>
      )}
      <BrandStory settings={settings} />
      <InstagramSection settings={settings} />
    </main>
  );
}
