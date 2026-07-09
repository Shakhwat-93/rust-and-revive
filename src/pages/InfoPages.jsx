// src/pages/InfoPages.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldAlert, Truck, RefreshCw, Ruler, BookOpen, MessageCircle } from 'lucide-react';

/* ─── Sizing Guide Page ──────────────────────────────────────────────── */
export function SizingGuide() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Help & Guides</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Sizing Guide</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <Ruler className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">How to Find Your Fit</h2>
              <p className="text-surface-secondary text-sm mt-1">
                Our garments are designed with a modern, relaxed/oversized streetwear fit. We recommend ordering your standard size for the intended oversized look, or sizing down if you prefer a more tailored fit.
              </p>
            </div>
          </div>

          <div className="border-t border-base-300/30 pt-6">
            <h3 className="font-bold text-sm text-surface-secondary uppercase tracking-wider mb-4">Standard Sizing Table (Inches)</h3>
            <div className="overflow-x-auto rounded-lg border border-base-300/30">
              <table className="w-full text-center border-collapse font-mono text-sm">
                <thead>
                  <tr className="bg-base-900/80 border-b border-base-300/30">
                    <th className="py-3 px-4 font-bold text-surface-secondary uppercase text-xs">Size</th>
                    <th className="py-3 px-4 font-bold text-surface-secondary uppercase text-xs">Chest</th>
                    <th className="py-3 px-4 font-bold text-surface-secondary uppercase text-xs">Waist</th>
                    <th className="py-3 px-4 font-bold text-surface-secondary uppercase text-xs">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/30">
                  <tr className="hover:bg-base-900/20">
                    <td className="py-3 px-4 font-bold text-brand">S</td>
                    <td className="py-3 px-4">36 - 38</td>
                    <td className="py-3 px-4">28 - 30</td>
                    <td className="py-3 px-4">27</td>
                  </tr>
                  <tr className="hover:bg-base-900/20">
                    <td className="py-3 px-4 font-bold text-brand">M</td>
                    <td className="py-3 px-4">38 - 40</td>
                    <td className="py-3 px-4">30 - 32</td>
                    <td className="py-3 px-4">28</td>
                  </tr>
                  <tr className="hover:bg-base-900/20">
                    <td className="py-3 px-4 font-bold text-brand">L</td>
                    <td className="py-3 px-4">40 - 42</td>
                    <td className="py-3 px-4">32 - 34</td>
                    <td className="py-3 px-4">29</td>
                  </tr>
                  <tr className="hover:bg-base-900/20">
                    <td className="py-3 px-4 font-bold text-brand">XL</td>
                    <td className="py-3 px-4">42 - 44</td>
                    <td className="py-3 px-4">34 - 36</td>
                    <td className="py-3 px-4">30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shipping Info Page ─────────────────────────────────────────────── */
export function ShippingInfo() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Help & Guides</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Shipping Policy</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <Truck className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">Cash On Delivery All Over Bangladesh</h2>
              <p className="text-surface-secondary text-sm mt-1">
                We provide cash on delivery service to all locations across Bangladesh. Review our delivery charges and zones below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-base-300/30 pt-6">
            <div className="p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <h3 className="font-bold text-brand text-xs uppercase tracking-wider mb-2">Inside Dhaka</h3>
              <p className="text-xl font-black text-surface-primary">৳ 80</p>
            </div>
            
            <div className="p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <h3 className="font-bold text-brand text-xs uppercase tracking-wider mb-2">Sub Dhaka</h3>
              <p className="text-xl font-black text-surface-primary">৳ 100</p>
              <p className="text-[10px] text-surface-muted mt-1">(Narayanganj, Keraniganj, Savar, Gazipur)</p>
            </div>

            <div className="p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <h3 className="font-bold text-brand text-xs uppercase tracking-wider mb-2">Outside Dhaka</h3>
              <p className="text-xl font-black text-surface-primary">৳ 150</p>
            </div>
          </div>

          <div className="border-t border-base-300/30 pt-6 space-y-3 text-sm text-surface-secondary">
            <p className="font-semibold text-surface-primary">Please note:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Delivery charges are non-refundable.</li>
              <li>If you return the product, you must pay the delivery charge.</li>
            </ul>
          </div>

          <div className="border-t border-base-300/30 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-surface-muted">
            <div>
              <p className="font-bold text-surface-primary">Rust & Revive</p>
              <p className="mt-1">Mobile: <a href="tel:+8801340185659" className="hover:text-brand font-mono">+8801340185659</a></p>
            </div>
            <div>
              <a 
                href="https://www.facebook.com/rustandrevive" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-brand font-bold hover:underline"
              >
                Follow us on Facebook →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Returns & Exchanges Page ───────────────────────────────────────── */
export function ReturnsExchanges() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Help & Guides</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Returns & Exchanges</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <RefreshCw className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">Our Return Policy</h2>
              <p className="text-surface-secondary text-sm mt-1">
                We want you to love your streetwear fit. If you're not completely satisfied, we offer a straightforward return/exchange process.
              </p>
            </div>
          </div>

          <div className="border-t border-base-300/30 pt-6 space-y-4 text-sm text-surface-secondary">
            <p>
              <strong className="text-surface-primary">1. Time Limit:</strong> Requests for return/exchange must be submitted within 7 days of receiving the package.
            </p>
            <p>
              <strong className="text-surface-primary">2. Condition:</strong> Items must be unworn, unwashed, and still have all tags attached in original packaging.
            </p>
            <p>
              <strong className="text-surface-primary">3. Processing:</strong> Please contact us via email or phone to initiate your exchange. Courier fees for exchanges are the responsibility of the customer unless the product arrived damaged or defective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Contact Us Page ────────────────────────────────────────────────── */
export function ContactUs() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Get in Touch</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Contact Us</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <Mail className="text-brand mb-2" size={20} />
              <p className="text-xs text-surface-muted">Email Us</p>
              <a href="mailto:rustandrevive@gmail.com" className="font-bold text-xs text-surface-primary mt-1 hover:text-brand transition-colors line-clamp-1">
                rustandrevive@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <Phone className="text-brand mb-2" size={20} />
              <p className="text-xs text-surface-muted">Call Support</p>
              <a href="tel:+8801340185659" className="font-bold text-sm text-surface-primary mt-1 hover:text-brand transition-colors">
                +880 1340-185659
              </a>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-base-900/40 border border-base-300/30">
              <MessageCircle className="text-brand mb-2" size={20} />
              <p className="text-xs text-surface-muted">WhatsApp</p>
              <a 
                href="https://wa.me/8801340185659" 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-sm text-surface-primary mt-1 hover:text-brand transition-colors"
              >
                +880 1340-185659
              </a>
            </div>
          </div>

          <div className="border-t border-base-300/30 pt-6 flex flex-col items-center text-center space-y-2">
            <MapPin className="text-brand" size={20} />
            <p className="text-xs text-surface-muted">Main Office & Warehouse</p>
            <p className="font-bold text-sm text-surface-primary">Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Our Story Page ─────────────────────────────────────────────────── */
export function OurStory() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">About Rust Revive</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Our Story</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <BookOpen className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">Born From the Streets. Built for the Future.</h2>
              <p className="text-surface-secondary text-sm mt-3">
                Rust Revive was born in Dhaka out of frustration — the frustration of paying premium prices for average quality, or settling for cheap products that fall apart after one wash.
              </p>
              <p className="text-surface-secondary text-sm mt-3">
                We set out to prove that you don't have to choose. Premium heavyweight materials, real craftsmanship, and designs that actually hit — all at prices that respect the hustle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Privacy Policy Page ────────────────────────────────────────────── */
export function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Legal</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Privacy Policy</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6 text-sm text-surface-secondary leading-relaxed">
          <p className="font-medium text-surface-primary text-base">At Rust & Revive, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit or make a purchase from our website.</p>
          
          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">1. Information We Collect</h2>
            <p>When you visit our site or place an order, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Shipping address</li>
              <li>Billing address</li>
              <li>Payment information (processed securely through third-party gateways)</li>
              <li>Order history and product preferences</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and deliver your orders</li>
              <li>Communicate with you about your purchase</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send updates, offers, or promotions (only if you agree)</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">3. Sharing Your Information</h2>
            <p>We do not sell, trade, or rent your personal information. We only share data with trusted third parties such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delivery partners</li>
              <li>Payment processors</li>
              <li>Website and marketing service providers</li>
            </ul>
            <p>These partners are required to keep your information secure.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">4. Data Security</h2>
            <p>We take appropriate security measures to protect your personal information from unauthorized access, misuse, or loss.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">5. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience. Cookies help us understand customer behavior and improve our services.</p>
            <p>You can disable cookies in your browser settings if you prefer.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">6. Your Rights</h2>
            <p>You may request to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>View your personal data</li>
              <li>Correct your information</li>
              <li>Delete your data from our system</li>
            </ul>
            <p>To do so, please contact us.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">7. Policy Updates</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-base-300/30">
            <h2 className="font-black text-lg text-surface-primary">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p className="font-bold text-surface-primary mt-2">Rust & Revive</p>
            <p>Email: <a href="mailto:rustandrevive@gmail.com" className="text-brand hover:underline font-medium">rustandrevive@gmail.com</a></p>
            <p>Phone: <a href="tel:+8801340185659" className="text-brand hover:underline font-medium">+8801340185659</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Terms of Service Page ─────────────────────────────────────────── */
export function TermsOfService() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Legal</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Terms of Service</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <ShieldAlert className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">Terms & Conditions</h2>
              <p className="text-surface-secondary text-sm mt-2">
                By purchasing from Rust Revive, you agree to our shipping policy (cash on delivery, non-refundable delivery charges) and exchange policies. All graphics, branding, and garments are intellectual property of Rust Revive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cookie Policy Page ─────────────────────────────────────────────── */
export function CookiePolicy() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-base-800 text-surface-primary">
      <div className="container-site max-w-3xl">
        <p className="section-label mb-2">Legal</p>
        <h1 className="font-black text-3xl sm:text-4xl text-surface-primary mb-6">Cookie Policy</h1>
        
        <div className="glass-dark p-6 sm:p-8 rounded-xl border border-base-300/40 space-y-6">
          <div className="flex gap-4 items-start">
            <ShieldAlert className="text-brand flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-bold text-lg text-surface-primary">How We Use Cookies</h2>
              <p className="text-surface-secondary text-sm mt-2">
                We use cookies to maintain your shopping cart state, recall your checkout preferences, and analyze website traffic. You can choose to disable cookies in your browser settings, but it may affect your shopping experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
