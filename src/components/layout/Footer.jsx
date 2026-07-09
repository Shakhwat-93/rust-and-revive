// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'Hoodies', to: '/shop?cat=hoodies' },
    { label: 'Tees', to: '/shop?cat=tees' },
    { label: 'Bottoms', to: '/shop?cat=bottoms' },
    { label: 'Jackets', to: '/shop?cat=jackets' },
  ],
  Help: [
    { label: 'Shipping Info', to: '/shipping-info' },
    { label: 'Returns & Exchanges', to: '/returns-exchanges' },
    { label: 'Track Order', to: '/track' },
    { label: 'Contact Us', to: '/contact-us' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial-brand opacity-30 pointer-events-none" />

      <div className="container-site py-12 relative z-10">

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
