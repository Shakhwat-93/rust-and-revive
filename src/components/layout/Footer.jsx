// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MessageCircle, Play, Zap, ArrowUpRight, Mail } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'Hoodies', to: '/shop?cat=hoodies' },
    { label: 'Tees', to: '/shop?cat=tees' },
    { label: 'Bottoms', to: '/shop?cat=bottoms' },
    { label: 'Jackets', to: '/shop?cat=jackets' },
  ],
  Help: [
    { label: 'Sizing Guide', to: '#' },
    { label: 'Shipping Info', to: '#' },
    { label: 'Returns & Exchanges', to: '#' },
    { label: 'Track Order', to: '#' },
    { label: 'Contact Us', to: '#' },
  ],
  Brand: [
    { label: 'Our Story', to: '#' },
    { label: 'Sustainability', to: '#' },
    { label: 'Collaborations', to: '#' },
    { label: 'Press', to: '#' },
    { label: 'Admin Panel', to: '/admin' },
  ],
};

const socials = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Twitter', href: '#' },
  { icon: Play, label: 'YouTube', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial-brand opacity-30 pointer-events-none" />

      <div className="container-site py-20 relative z-10">

        {/* Top — Brand + Newsletter */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
          {/* Brand */}
          <div className="lg:w-80 flex-shrink-0">
            <Link to="/" className="inline-block mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-glow-sm">
                <img src="/logo.webp" alt="Rust Revive Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
            <p className="text-surface-secondary text-small leading-relaxed mb-6">
              Premium streetwear for the next generation. Built for the streets of Dhaka and worn everywhere.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-surface-muted hover:text-brand hover:border-brand/30 transition-colors duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1">
            <div className="glass-brand rounded-xl p-6 lg:p-8">
              <h3 className="font-bold text-h4 mb-1">First drops, first access.</h3>
              <p className="text-surface-secondary text-small mb-5">
                Join 5,000+ Gen-Z subscribers. No spam, just drops.
              </p>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input pl-9"
                    id="newsletter-email"
                  />
                </div>
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mb-12" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="section-label mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-small text-surface-muted hover:text-surface-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.to === '/admin' && (
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-muted">
            © 2026 Rust Revive. All rights reserved. Made by{' '}
            <a 
              href="https://shakhwatrasel.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-400 transition-colors font-medium"
            >
              Shakhwat Hossain Rasel
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Privacy</Link>
            <Link to="#" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Terms</Link>
            <Link to="#" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
