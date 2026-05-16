// src/pages/admin/Products.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Check, Package, Eye } from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { Link } from 'react-router-dom';

const formatPrice = (p) => `৳${p.toLocaleString('en-BD')}`;

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-h3">Products</h2>
          <p className="text-surface-muted text-small mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          id="add-product-btn"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-9"
          id="products-search"
        />
      </div>

      {/* Product Table */}
      <motion.div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-base-500 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-surface-primary">{product.name}</p>
                          <p className="text-[10px] text-surface-muted font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize">{product.category}</td>
                    <td>
                      <div>
                        <p className="font-semibold text-surface-primary">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-[10px] text-surface-muted line-through">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={product.inStock ? 'badge-success' : 'badge-danger'}>
                        {product.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-brand text-xs">★</span>
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-[10px] text-surface-muted">({product.reviews})</span>
                      </div>
                    </td>
                    <td>
                      {product.badge ? (
                        <span className={`badge text-[10px] ${
                          product.badge === 'LIMITED' ? 'badge-brand' :
                          product.badge === 'NEW DROP' ? 'badge-success' :
                          product.badge === 'SALE' ? 'badge-danger' :
                          'badge'
                        }`}>
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-surface-muted text-xs">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          className="btn-icon w-8 h-8 text-surface-muted hover:text-blue-400"
                          title="View"
                        >
                          <Eye size={14} />
                        </Link>
                        <button className="btn-icon w-8 h-8 text-surface-muted hover:text-brand" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="btn-icon w-8 h-8 text-surface-muted hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Package size={32} className="text-surface-muted" />
              <p className="text-surface-muted text-small">No products found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-dark rounded-2xl p-6 max-w-sm w-full border border-base-300">
                <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <h3 className="font-bold text-h4 text-center mb-2">Delete Product?</h3>
                <p className="text-surface-muted text-small text-center mb-6">
                  This action cannot be undone. The product will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold text-small hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-dark rounded-2xl p-6 max-w-lg w-full border border-base-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-h4">Add New Product</h3>
                  <button onClick={() => setModalOpen(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'prod-name', label: 'Product Name', type: 'text', placeholder: 'e.g. Rust Oversized Hoodie' },
                    { id: 'prod-category', label: 'Category', type: 'text', placeholder: 'hoodies / tees / bottoms / jackets' },
                    { id: 'prod-price', label: 'Price (BDT)', type: 'number', placeholder: '0' },
                    { id: 'prod-orig-price', label: 'Original Price (optional)', type: 'number', placeholder: '0' },
                  ].map(field => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="input"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Product description..."
                      className="input resize-none"
                      id="prod-desc"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">Badge (optional)</label>
                    <select className="input" id="prod-badge">
                      <option value="">No Badge</option>
                      <option value="NEW DROP">New Drop</option>
                      <option value="BESTSELLER">Bestseller</option>
                      <option value="LIMITED">Limited</option>
                      <option value="SALE">Sale</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={() => setModalOpen(false)} className="btn-primary flex-1">
                    <Check size={16} />
                    Save Product
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
