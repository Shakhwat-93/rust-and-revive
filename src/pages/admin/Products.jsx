import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Check, Package, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../lib/api';
import { Link } from 'react-router-dom';

const formatPrice = (p) => `৳${Number(p).toLocaleString('en-BD')}`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    original_price: '',
    badge: '',
    image: '',
    description: '',
    long_description: '',
    in_stock: true,
    sizes: 'S, M, L, XL',
    colors: 'black',
    size_guide_json: '{\n  "S": "Chest 40, Length 27",\n  "M": "Chest 42, Length 28",\n  "L": "Chest 44, Length 29",\n  "XL": "Chest 46, Length 30"\n}',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      setError('Failed to load products or categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?.slug || '',
      price: '',
      original_price: '',
      badge: '',
      image: '',
      description: '',
      long_description: '',
      in_stock: true,
      sizes: 'S, M, L, XL',
      colors: 'black',
      size_guide_json: '{\n  "S": "Chest 40, Length 27",\n  "M": "Chest 42, Length 28",\n  "L": "Chest 44, Length 29",\n  "XL": "Chest 46, Length 30"\n}',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category || categories[0]?.slug || '',
      price: p.price,
      original_price: p.original_price || '',
      badge: p.badge || '',
      image: p.image || '',
      description: p.description || '',
      long_description: p.long_description || '',
      in_stock: p.in_stock ?? true,
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || '',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || '',
      size_guide_json: p.size_guide ? JSON.stringify(p.size_guide, null, 2) : '{\n  "S": "Chest 40, Length 27"\n}',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      // Parse sizes & colors
      const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
      const colorsArray = formData.colors.split(',').map((c) => c.trim()).filter(Boolean);

      // Parse size guide json
      let parsedSizeGuide = null;
      try {
        parsedSizeGuide = JSON.parse(formData.size_guide_json);
      } catch (err) {
        throw new Error('Invalid JSON format in Size Guide');
      }

      const payload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        badge: formData.badge || null,
        image: formData.image,
        images: [formData.image],
        description: formData.description,
        long_description: formData.long_description,
        in_stock: Boolean(formData.in_stock),
        sizes: sizesArray,
        colors: colorsArray,
        size_guide: parsedSizeGuide,
      };

      if (editProduct) {
        await updateProduct(editProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error saving product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (err) {
      alert('Error deleting product: ' + (err.message || err));
    } finally {
      setDeleteId(null);
    }
  };

  const toggleStock = async (product) => {
    try {
      const updated = await updateProduct(product.id, { in_stock: !product.in_stock });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      alert('Error updating stock status');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-h3">Products</h2>
          <p className="text-surface-muted text-small mt-1">{products.length} total products</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary" id="add-product-btn">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search products by name, slug or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
          id="products-search"
        />
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="card py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="text-brand animate-spin" />
          <p className="text-surface-muted text-small">Loading products from Supabase...</p>
        </div>
      ) : (
        <motion.div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
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
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-base-500 flex-shrink-0 border border-base-300">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-surface-primary">{product.name}</p>
                            <p className="text-[10px] text-surface-muted font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="capitalize font-medium">{product.category}</td>
                      <td>
                        <div>
                          <p className="font-semibold text-surface-primary">{formatPrice(product.price)}</p>
                          {product.original_price && (
                            <p className="text-[10px] text-surface-muted line-through">{formatPrice(product.original_price)}</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleStock(product)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            product.in_stock
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                          }`}
                          title="Click to toggle stock status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                          {product.in_stock ? 'In Stock' : 'Stock Out'}
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <span className="text-brand text-xs">★</span>
                          <span className="text-xs font-medium">{product.rating || '5.0'}</span>
                          <span className="text-[10px] text-surface-muted">({product.reviews_count || 0})</span>
                        </div>
                      </td>
                      <td>
                        {product.badge ? (
                          <span
                            className={`badge text-[10px] font-bold tracking-wider uppercase ${
                              product.badge === 'LIMITED'
                                ? 'badge-brand'
                                : product.badge === 'NEW DROP'
                                ? 'badge-success'
                                : product.badge === 'SALE'
                                ? 'badge-danger'
                                : 'badge'
                            }`}
                          >
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
                            title="View Live Page"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="btn-icon w-8 h-8 text-surface-muted hover:text-brand"
                            title="Edit"
                          >
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
      )}

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                  This action cannot be undone. The product will be permanently removed from Supabase.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
                    Cancel
                  </button>
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

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-dark rounded-2xl p-8 max-w-2xl w-full border border-base-300 max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
                  <h3 className="font-bold text-h4">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => setModalOpen(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Product Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Void Cargo Pants"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            name,
                            slug: editProduct ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                          }));
                        }}
                        className="input text-small"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Slug * (Unique URL identifier)
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. void-cargo-pants"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="input text-small font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="input text-small capitalize"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Price (BDT) *
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="3200"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        className="input text-small font-mono font-bold text-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Original Price (Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="3800"
                        value={formData.original_price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                        className="input text-small font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Image URL *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="/images/cargo-black.webp or https://..."
                        value={formData.image}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        className="input text-small"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Badge Tag (Optional)
                      </label>
                      <select
                        value={formData.badge}
                        onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                        className="input text-small font-semibold tracking-wide uppercase"
                      >
                        <option value="">No Badge</option>
                        <option value="NEW DROP">New Drop</option>
                        <option value="BESTSELLER">Bestseller</option>
                        <option value="LIMITED">Limited</option>
                        <option value="SALE">Sale</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Available Sizes (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="S, M, L, XL or 28, 30, 32"
                        value={formData.sizes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sizes: e.target.value }))}
                        className="input text-small font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                        Available Colors (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="black, rust, charcoal"
                        value={formData.colors}
                        onChange={(e) => setFormData((prev) => ({ ...prev, colors: e.target.value }))}
                        className="input text-small font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Short Description (Card Subtitle)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Heavy premium fleece. Dropped shoulders..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="input resize-none text-small"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Long Description (Detail Page Overview)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed overview of fabric, cut, and design philosophy..."
                      value={formData.long_description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                      className="input resize-none text-small"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5 flex items-center justify-between">
                      <span>Size Guide JSON (Measurements Table)</span>
                      <span className="text-[10px] text-brand font-mono font-normal">JSON format key-value pairs</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder='{\n  "S": "Chest 40, Length 27"\n}'
                      value={formData.size_guide_json}
                      onChange={(e) => setFormData((prev) => ({ ...prev, size_guide_json: e.target.value }))}
                      className="input font-mono text-xs bg-base-950 text-emerald-400 focus:text-emerald-300"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-base-500/50 border border-base-300">
                    <input
                      type="checkbox"
                      id="in-stock-checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, in_stock: e.target.checked }))}
                      className="w-5 h-5 accent-brand rounded cursor-pointer"
                    />
                    <label htmlFor="in-stock-checkbox" className="text-small font-semibold cursor-pointer select-none">
                      Product is currently In Stock
                    </label>
                  </div>

                  <div className="flex gap-3 mt-8 pt-4 border-t border-base-300">
                    <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-3 text-small">
                      Cancel
                    </button>
                    <button type="submit" disabled={formLoading} className="btn-primary flex-1 py-3 text-small flex items-center justify-center gap-2 shadow-glow">
                      {formLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={18} />
                          {editProduct ? 'Update Product' : 'Save Product'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
