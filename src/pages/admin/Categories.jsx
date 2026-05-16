import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Check, FolderKanban, AlertCircle, Loader2 } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../lib/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditCategory(null);
    setFormData({ slug: '', name: '', description: '', image_url: '' });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditCategory(cat);
    setFormData({
      slug: cat.slug,
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      if (editCategory) {
        await updateCategory(editCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      await fetchCategories();
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error saving category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert('Error deleting category: ' + (err.message || err));
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-h3">Categories</h2>
          <p className="text-surface-muted text-small mt-1">{categories.length} total categories</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary" id="add-category-btn">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Table / Loading */}
      {loading ? (
        <div className="card py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="text-brand animate-spin" />
          <p className="text-surface-muted text-small">Loading categories...</p>
        </div>
      ) : (
        <motion.div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((cat, i) => (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-base-500 flex-shrink-0 border border-base-300 flex items-center justify-center font-bold text-surface-muted">
                            {cat.image_url ? (
                              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              cat.name[0]
                            )}
                          </div>
                          <p className="font-semibold text-surface-primary">{cat.name}</p>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-base-500 text-brand font-semibold">
                          {cat.slug}
                        </span>
                      </td>
                      <td className="max-w-md">
                        <p className="text-xs text-surface-muted line-clamp-2">
                          {cat.description || 'No description provided.'}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="btn-icon w-8 h-8 text-surface-muted hover:text-brand"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat.id)}
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
                <FolderKanban size={32} className="text-surface-muted" />
                <p className="text-surface-muted text-small">No categories found</p>
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
                <h3 className="font-bold text-h4 text-center mb-2">Delete Category?</h3>
                <p className="text-surface-muted text-small text-center mb-6">
                  This action cannot be undone. Category will be permanently removed. Note: ensure no products reference this slug before deleting.
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
              <div className="glass-dark rounded-2xl p-6 max-w-lg w-full border border-base-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-h4">{editCategory ? 'Edit Category' : 'Add New Category'}</h3>
                  <button onClick={() => setModalOpen(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-4">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Category Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Hoodies"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          name,
                          slug: editCategory ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        }));
                      }}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Slug * (Unique identifier)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. hoodies"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="input font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Image URL (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/hoodie-rust.webp or https://..."
                      value={formData.image_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-secondary mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Category description..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="input resize-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button type="submit" disabled={formLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {formLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={16} />
                          {editCategory ? 'Update Category' : 'Save Category'}
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
