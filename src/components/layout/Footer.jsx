// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, Mail } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'Hoodies', to: '/shop?cat=hoodies' },
    { label: 'Tees', to: '/shop?cat=tees' },
    { label: 'Bottoms', to: '/shop?cat=bottoms' },
    { label: 'Jackets', to: '/shop?cat=jackets' },
  ],
  Help: [
    { label: 'Sizing Guide', to: '/sizing-guide' },
    { label: 'Shipping Info', to: '/shipping-info' },
    { label: 'Returns & Exchanges', to: '/returns-exchanges' },
    { label: 'Track Order', to: '/track' },
    { label: 'Contact Us', to: '/contact-us' },
  ],
};

const socials = [
  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/rustandrevive' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/rustandrevive' },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial-brand opacity-30 pointer-events-none" />

      <div className="container-site py-20 relative z-10">

        {/* Top — Brand */}
        <div className="flex flex-col lg:flex-row gap-12 justify-between items-start mb-16">
          {/* Brand */}
          <div className="lg:w-96">
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
            <Link to="/privacy-policy" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Terms</Link>
            <Link to="/cookie-policy" className="text-xs text-surface-muted hover:text-surface-secondary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
