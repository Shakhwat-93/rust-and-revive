import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Globe, Layout, Type, FileText, Loader2, Image, Layers, Star } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../lib/api';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

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

const defaultShop = {
  title: "Shop All",
  subtitle: "The Catalog"
};

export default function WebsitePages() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'shop'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [homeData, setHomeData] = useState(defaultHome);
  const [shopData, setShopData] = useState(defaultShop);
  const [statsText, setStatsText] = useState(JSON.stringify(defaultHome.brandStoryStats, null, 2));

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [h, s] = await Promise.all([
          getSiteSettings('home_page'),
          getSiteSettings('shop_page'),
        ]);

        if (h) {
          const mergedH = { ...defaultHome, ...h };
          setHomeData(mergedH);
          setStatsText(JSON.stringify(h.brandStoryStats || defaultHome.brandStoryStats, null, 2));
        }
        if (s) {
          setShopData({ ...defaultShop, ...s });
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleHomeChange = (key, value) => {
    setHomeData((prev) => ({ ...prev, [key]: value }));
  };

  const handleShopChange = (key, value) => {
    setShopData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      let statsObj = homeData.brandStoryStats;
      try {
        statsObj = JSON.parse(statsText);
      } catch (e) {
        console.warn('Invalid stats JSON, keeping existing stats');
      }

      const newHome = { ...homeData, brandStoryStats: statsObj };
      setHomeData(newHome);

      if (activeTab === 'home') {
        await updateSiteSettings('home_page', newHome);
      } else {
        await updateSiteSettings('shop_page', shopData);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving site settings:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const currentInstaImages = homeData.instagramImages || defaultHome.instagramImages;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-base-300">
        <div>
          <h1 className="text-h3 font-black text-surface-primary flex items-center gap-2">
            <Globe className="text-brand" />
            Website Content Manager
          </h1>
          <p className="text-surface-secondary text-small mt-1">
            Dynamically update live website copy, section headings, images, and social links in real-time.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-small transition-all duration-200 ${
            saved ? 'bg-emerald-500 text-white shadow-glow-sm' : 'bg-brand text-white hover:bg-brand-400 shadow-glow'
          }`}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Saved Successfully!
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-base-300 pb-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-small font-bold transition-all duration-200 ${
            activeTab === 'home'
              ? 'bg-brand text-white shadow-glow-sm'
              : 'text-surface-secondary hover:text-surface-primary glass'
          }`}
        >
          <Layout size={16} />
          Home Page Sections
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-small font-bold transition-all duration-200 ${
            activeTab === 'shop'
              ? 'bg-brand text-white shadow-glow-sm'
              : 'text-surface-secondary hover:text-surface-primary glass'
          }`}
        >
          <FileText size={16} />
          Shop Page Header
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
          <Loader2 size={36} className="text-brand animate-spin" />
          <p className="text-surface-muted text-small uppercase tracking-widest font-mono">Loading Page Content...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hero Section Copy */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <Type size={18} />
                  Hero Section
                </h2>

                <div>
                  <label className="label flex items-center gap-1.5 font-bold">
                    <Image size={15} className="text-brand" />
                    Hero Background Image URL
                  </label>
                  <input
                    type="text"
                    className="input font-mono text-sm"
                    value={homeData.heroBgImage || ''}
                    onChange={(e) => handleHomeChange('heroBgImage', e.target.value)}
                  />
                  <p className="text-xs text-surface-muted mt-1">Provide a relative path (e.g. /images/hero-banner.webp) or an absolute image URL.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Hero Top Badge</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.heroBadge || ''}
                      onChange={(e) => handleHomeChange('heroBadge', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Sub Badge / Season</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.heroSubBadge || ''}
                      onChange={(e) => handleHomeChange('heroSubBadge', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Hero Main Heading (Use \n or new line for break)</label>
                  <textarea
                    rows={2}
                    className="input py-3 font-mono font-bold text-lg"
                    value={homeData.heroHeading || ''}
                    onChange={(e) => handleHomeChange('heroHeading', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Hero Subtext</label>
                  <textarea
                    rows={2}
                    className="input py-3"
                    value={homeData.heroSubtext || ''}
                    onChange={(e) => handleHomeChange('heroSubtext', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Call to Action (CTA) Button Text</label>
                  <input
                    type="text"
                    className="input max-w-xs font-bold"
                    value={homeData.heroButtonText || ''}
                    onChange={(e) => handleHomeChange('heroButtonText', e.target.value)}
                  />
                </div>
              </div>

              {/* Collections Section Header */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <Layers size={18} />
                  Collections Section Header
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Section Subtitle / Label</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.collectionsLabel || ''}
                      onChange={(e) => handleHomeChange('collectionsLabel', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Main Title</label>
                    <input
                      type="text"
                      className="input font-bold"
                      value={homeData.collectionsTitle || ''}
                      onChange={(e) => handleHomeChange('collectionsTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Latest Drop Section Header */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <Star size={18} />
                  Latest Drop Section Header
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Section Subtitle / Label</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.latestLabel || ''}
                      onChange={(e) => handleHomeChange('latestLabel', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Main Title</label>
                    <input
                      type="text"
                      className="input font-bold"
                      value={homeData.latestTitle || ''}
                      onChange={(e) => handleHomeChange('latestTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Catalog Section Header */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <Layout size={18} />
                  Product Catalog Section Header
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Section Subtitle / Label</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.catalogLabel || ''}
                      onChange={(e) => handleHomeChange('catalogLabel', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Main Title</label>
                    <input
                      type="text"
                      className="input font-bold"
                      value={homeData.catalogTitle || ''}
                      onChange={(e) => handleHomeChange('catalogTitle', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Section Description / Subtext</label>
                  <textarea
                    rows={2}
                    className="input py-3"
                    value={homeData.catalogSubtext || ''}
                    onChange={(e) => handleHomeChange('catalogSubtext', e.target.value)}
                  />
                </div>
              </div>

              {/* Brand Story Copy */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Brand Story Section
                </h2>

                <div>
                  <label className="label flex items-center gap-1.5 font-bold">
                    <Image size={15} className="text-brand" />
                    Brand Story Image URL
                  </label>
                  <input
                    type="text"
                    className="input font-mono text-sm"
                    value={homeData.brandStoryImage || ''}
                    onChange={(e) => handleHomeChange('brandStoryImage', e.target.value)}
                  />
                  <p className="text-xs text-surface-muted mt-1">Provide a relative path (e.g. /images/hoodie-rust.webp) or an absolute image URL.</p>
                </div>

                <div>
                  <label className="label">Section Subtitle / Label</label>
                  <input
                    type="text"
                    className="input max-w-xs"
                    value={homeData.brandStoryLabel || ''}
                    onChange={(e) => handleHomeChange('brandStoryLabel', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Brand Story Heading</label>
                  <textarea
                    rows={2}
                    className="input py-3 font-mono font-bold"
                    value={homeData.brandStoryTitle || ''}
                    onChange={(e) => handleHomeChange('brandStoryTitle', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Story Paragraph 1</label>
                  <textarea
                    rows={3}
                    className="input py-3 text-small leading-relaxed"
                    value={homeData.brandStoryText1 || ''}
                    onChange={(e) => handleHomeChange('brandStoryText1', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Story Paragraph 2</label>
                  <textarea
                    rows={3}
                    className="input py-3 text-small leading-relaxed"
                    value={homeData.brandStoryText2 || ''}
                    onChange={(e) => handleHomeChange('brandStoryText2', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Brand Story Stats (JSON Array)</label>
                  <textarea
                    rows={5}
                    className="input py-3 font-mono text-xs bg-base-950 text-brand"
                    value={statsText}
                    onChange={(e) => setStatsText(e.target.value)}
                  />
                </div>
              </div>

              {/* Instagram / Social Section Header */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <InstagramIcon size={18} />
                  Instagram Community Section
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Section Subtitle / Label</label>
                    <input
                      type="text"
                      className="input"
                      value={homeData.instagramLabel || ''}
                      onChange={(e) => handleHomeChange('instagramLabel', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Main Title</label>
                    <input
                      type="text"
                      className="input font-bold"
                      value={homeData.instagramTitle || ''}
                      onChange={(e) => handleHomeChange('instagramTitle', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Section Subtext</label>
                  <input
                    type="text"
                    className="input"
                    value={homeData.instagramSubtext || ''}
                    onChange={(e) => handleHomeChange('instagramSubtext', e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label flex items-center gap-1.5 font-bold text-brand">
                      <InstagramIcon size={15} />
                      Official Instagram Account URL
                    </label>
                    <input
                      type="text"
                      className="input font-mono text-xs"
                      value={homeData.instagramUrl || ''}
                      onChange={(e) => handleHomeChange('instagramUrl', e.target.value)}
                    />
                    <p className="text-xs text-surface-muted mt-1">Opens when users click "Follow Official" or any feed item.</p>
                  </div>

                  <div>
                    <label className="label flex items-center gap-1.5 font-bold">
                      <Image size={15} className="text-brand" />
                      Brand Profile Avatar Image URL
                    </label>
                    <input
                      type="text"
                      className="input font-mono text-xs"
                      value={homeData.instagramProfileImage || ''}
                      onChange={(e) => handleHomeChange('instagramProfileImage', e.target.value)}
                    />
                    <p className="text-xs text-surface-muted mt-1">Circular avatar photo for rust.revive in the showcase card.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-base-300/50">
                  <label className="label font-bold text-brand flex items-center gap-1.5">
                    <Image size={15} />
                    Instagram Feed Showcase Images (4 Posts)
                  </label>
                  <p className="text-xs text-surface-muted">Customize the 4 showcase photos and their engagement counts displayed in the interactive grid.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {currentInstaImages.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-base-950 border border-base-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-surface-primary">Post Card #{idx + 1}</span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-800 border border-base-300 flex-shrink-0">
                            <img src={item.src} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-surface-secondary">Image URL</label>
                          <input
                            type="text"
                            className="input text-xs font-mono"
                            value={item.src || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeData((prev) => {
                                const arr = [...(prev.instagramImages || defaultHome.instagramImages)];
                                arr[idx] = { ...arr[idx], src: val };
                                return { ...prev, instagramImages: arr };
                              });
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-surface-secondary">Likes</label>
                            <input
                              type="text"
                              className="input text-xs font-mono"
                              value={item.likes || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeData((prev) => {
                                  const arr = [...(prev.instagramImages || defaultHome.instagramImages)];
                                  arr[idx] = { ...arr[idx], likes: val };
                                  return { ...prev, instagramImages: arr };
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-surface-secondary">Comments</label>
                            <input
                              type="text"
                              className="input text-xs font-mono"
                              value={item.comments || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeData((prev) => {
                                  const arr = [...(prev.instagramImages || defaultHome.instagramImages)];
                                  arr[idx] = { ...arr[idx], comments: val };
                                  return { ...prev, instagramImages: arr };
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Shop Page Copy */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <Layout size={18} />
                  Shop Catalog Header
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Shop Page Main Title</label>
                    <input
                      type="text"
                      className="input font-bold text-lg"
                      value={shopData.title || ''}
                      onChange={(e) => handleShopChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Subtitle / Section Label</label>
                    <input
                      type="text"
                      className="input text-surface-secondary"
                      value={shopData.subtitle || ''}
                      onChange={(e) => handleShopChange('subtitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
