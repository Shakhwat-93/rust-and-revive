import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Globe, Layout, Type, FileText, Loader2, RefreshCw } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../lib/api';

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
          setHomeData({ ...defaultHome, ...h });
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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-base-300">
        <div>
          <h1 className="text-h3 font-black text-surface-primary flex items-center gap-2">
            <Globe className="text-brand" />
            Website Content Manager
          </h1>
          <p className="text-surface-secondary text-small mt-1">
            Dynamically update live website copy, headings, and CTAs in real-time.
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
          Home Page
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
          Shop Page
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

              {/* Brand Story Copy */}
              <div className="glass rounded-2xl p-6 border border-base-300 space-y-5">
                <h2 className="font-bold text-h5 text-brand border-b border-base-300/50 pb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Brand Story Section
                </h2>

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
