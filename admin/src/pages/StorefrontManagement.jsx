// admin/src/pages/StorefrontManagement.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Package, 
  Layers, 
  Sliders, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Check, 
  X, 
  Search, 
  Loader2, 
  Eye, 
  Sparkles,
  Upload
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import './StorefrontManagement.css';

// Reusable Image Upload Input Component connected to Supabase Storage
const ImageUploadInput = ({ label, value, onChange, placeholder, required = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('storefront')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('storefront')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sf-form-group full-width">
      <label className="sf-label">{label}</label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
        <input
          type="text"
          className="sf-input"
          style={{ flex: 1 }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        <label 
          className="action-btn-green"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
            height: '100%'
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Upload File</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {value && (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          <span style={{ fontWeight: 800, color: 'var(--accent)' }}>Preview:</span>
          <a href={value} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{value}</a>
        </div>
      )}
    </div>
  );
};

// Reusable Multiple Image Upload Input Component connected to Supabase Storage
const MultipleImageUploadInput = ({ label, value = [], onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('storefront')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('storefront')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      console.error('Multiple upload error:', err);
      alert('Failed to upload image(s): ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= value.length) return;
    const updated = [...value];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="sf-form-group full-width" style={{ gridColumn: '1 / -1' }}>
      <label className="sf-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{value.length} images uploaded</span>
      </label>
      
      {/* Upload area */}
      <div style={{ marginBottom: '16px' }}>
        <label 
          className="action-btn-green"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="spin" />
              <span>Uploading Multiple...</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Upload Images</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
          gap: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          {value.map((url, idx) => (
            <div 
              key={idx} 
              style={{ 
                position: 'relative', 
                aspectRatio: '1', 
                borderRadius: '6px', 
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              className="mult-img-thumb"
            >
              <img 
                src={url} 
                alt={`Product image ${idx + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {/* Overlays for delete and move */}
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(0,0,0,0.6)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '4px',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
                className="mult-img-overlay"
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.9)', 
                      border: 'none', 
                      color: 'white', 
                      borderRadius: '4px', 
                      padding: '4px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                  <button 
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, -1)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      borderRadius: '4px', 
                      padding: '2px 6px', 
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    ◀
                  </button>
                  <span style={{ fontSize: '10px', color: 'white', alignSelf: 'center', fontWeight: 'bold' }}>#{idx + 1}</span>
                  <button 
                    type="button"
                    disabled={idx === value.length - 1}
                    onClick={() => moveImage(idx, 1)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      borderRadius: '4px', 
                      padding: '2px 6px', 
                      cursor: idx === value.length - 1 ? 'not-allowed' : 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Interactive Size Guide (Size Chart) Editor Table Component
const SizeGuideTableEditor = ({ value, onChange }) => {
  const columns = value?.columns || ['Size', 'Waist', 'Hips', 'Length'];
  const rows = value?.rows || [];
  const material = value?.material || 'Cotton 100%';

  const [newColName, setNewColName] = useState('');

  const addColumn = () => {
    if (!newColName.trim()) return;
    const name = newColName.trim();
    if (columns.includes(name)) {
      alert('Column already exists!');
      return;
    }
    const updatedCols = [...columns, name];
    const updatedRows = rows.map(row => ({ ...row, [name]: '' }));
    onChange({ columns: updatedCols, rows: updatedRows, material });
    setNewColName('');
  };

  const removeColumn = (colName) => {
    if (colName === 'Size') {
      alert('The "Size" column cannot be removed as it is the primary identifier.');
      return;
    }
    if (!confirm(`Are you sure you want to remove the column "${colName}"?`)) return;
    const updatedCols = columns.filter(c => c !== colName);
    const updatedRows = rows.map(row => {
      const copy = { ...row };
      delete copy[colName];
      return copy;
    });
    onChange({ columns: updatedCols, rows: updatedRows, material });
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col] = '';
    });
    onChange({ columns, rows: [...rows, newRow], material });
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, idx) => idx !== index);
    onChange({ columns, rows: updatedRows, material });
  };

  const handleCellChange = (rowIndex, colName, val) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [colName]: val };
    onChange({ columns, rows: updatedRows, material });
  };

  const handleMaterialChange = (val) => {
    onChange({ columns, rows, material: val });
  };

  return (
    <div className="sf-form-group full-width" style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', gridColumn: '1 / -1' }}>
      <label className="sf-label" style={{ fontSize: '13px', color: 'var(--accent)', marginBottom: '8px', display: 'block' }}>Size Chart Builder</label>
      
      {/* Material/Composition field */}
      <div className="sf-form-group" style={{ marginBottom: '16px', maxWidth: '300px' }}>
        <label className="sf-label" style={{ fontSize: '10px' }}>Material / Composition</label>
        <input 
          type="text" 
          className="sf-input" 
          value={material} 
          onChange={(e) => handleMaterialChange(e.target.value)}
          placeholder="e.g. Cotton 100%"
        />
      </div>

      {/* Add new Column form */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          className="sf-input" 
          style={{ width: '180px', padding: '6px 12px', fontSize: '12px' }}
          placeholder="New Column (e.g. Rise)"
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
        />
        <button 
          type="button" 
          className="action-btn-green"
          onClick={addColumn}
          style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '4px', height: 'auto', boxShadow: 'none' }}
        >
          + Add Column
        </button>
      </div>

      {/* Size Chart Table Grid */}
      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '4px', marginBottom: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
              {columns.map((col) => (
                <th key={col} style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--text-secondary)', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>{col}</span>
                    {col !== 'Size' && (
                      <button 
                        type="button" 
                        onClick={() => removeColumn(col)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '10px', padding: '0 4px' }}
                        title="Remove Column"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th style={{ width: '50px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {columns.map((col) => (
                  <td key={col} style={{ padding: '6px' }}>
                    <input 
                      type="text" 
                      className="sf-input" 
                      style={{ 
                        width: '100%', 
                        padding: '6px', 
                        textAlign: 'center', 
                        fontSize: '12px', 
                        background: col === 'Size' ? 'rgba(13, 148, 136, 0.05)' : 'transparent',
                        borderColor: col === 'Size' ? 'rgba(13, 148, 136, 0.2)' : 'var(--glass-border)',
                        color: col === 'Size' ? 'var(--accent)' : 'inherit',
                        fontWeight: col === 'Size' ? 800 : 'normal'
                      }}
                      value={row[col] || ''} 
                      onChange={(e) => handleCellChange(rIdx, col, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                ))}
                <td style={{ padding: '6px' }}>
                  <button 
                    type="button"
                    onClick={() => removeRow(rIdx)}
                    style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '20px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  No size guide rows added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button 
        type="button" 
        className="action-btn-green"
        onClick={addRow}
        style={{ padding: '8px 20px', fontSize: '12px', borderRadius: '4px', height: 'auto', boxShadow: 'none' }}
      >
        + Add Size Row
      </button>
    </div>
  );
};

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
  
  instagramLabel: "Join The Culture",
  instagramTitle: "Follow @rust.revive",
  instagramSubtext: "Tag us in your street fits to get featured on our official channel.",
  instagramUrl: "https://www.instagram.com/rust.revive?igsh=MWl3Y3N0MmM0MGRhMQ%3D%3D&utm_source=qr",
  instagramProfileImage: "/images/hoodie-rust.webp",
};

export const StorefrontManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [homeSettings, setHomeSettings] = useState(defaultHome);
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Banners tab sections
  const [bannerSection, setBannerSection] = useState('hero');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states for Product
  const [prodForm, setProdForm] = useState({
    name: '', slug: '', category: '', price: '', original_price: '',
    badge: '', image: '', description: '', long_description: '',
    in_stock: true, sizes: '', colors: '', inventory_id: ''
  });

  // Form states for Category
  const [catForm, setCatForm] = useState({
    name: '', slug: '', description: '', image_url: ''
  });

  useEffect(() => {
    fetchStorefrontData();
  }, []);

  const fetchStorefrontData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*, inventory:inventory_id(current_stock)')
        .order('created_at', { ascending: false });
      if (prodErr) throw prodErr;
      setProducts(prodData || []);

      // Fetch Categories
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      if (catErr) throw catErr;
      setCategories(catData || []);

      // Fetch Inventory
      const { data: invData, error: invErr } = await supabase
        .from('inventory')
        .select('id, name, sku, current_stock')
        .order('name', { ascending: true });
      if (invErr) throw invErr;
      setInventoryItems(invData || []);

      // Fetch Site Settings for Home page
      const { data: siteData, error: siteErr } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'home_page')
        .maybeSingle();
      if (siteErr) throw siteErr;
      if (siteData?.value) {
        setHomeSettings({ ...defaultHome, ...siteData.value });
      }
    } catch (err) {
      console.error('Error fetching storefront data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate slugs dynamically
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleProdNameChange = (e) => {
    const val = e.target.value;
    setProdForm(prev => ({
      ...prev,
      name: val,
      slug: prev.slug === generateSlug(prev.name) || prev.slug === '' ? generateSlug(val) : prev.slug
    }));
  };

  const handleCatNameChange = (e) => {
    const val = e.target.value;
    setCatForm(prev => ({
      ...prev,
      name: val,
      slug: prev.slug === generateSlug(prev.name) || prev.slug === '' ? generateSlug(val) : prev.slug
    }));
  };

  // Open Modal for Product Add/Edit
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      const defaultSizeGuide = {
        columns: ['Size', 'Waist', 'Hips', 'Length', 'Leg Opening', 'Rise'],
        rows: [],
        material: 'Cotton 100%'
      };
      setProdForm({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || '',
        price: product.price || '',
        original_price: product.original_price || '',
        badge: product.badge || '',
        image: product.image || '',
        images: Array.isArray(product.images) ? product.images : [],
        size_guide: product.size_guide && typeof product.size_guide === 'object' && Array.isArray(product.size_guide.columns) ? product.size_guide : defaultSizeGuide,
        description: product.description || '',
        long_description: product.long_description || '',
        in_stock: product.in_stock !== false,
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        inventory_id: product.inventory_id || ''
      });
    } else {
      const defaultSizeGuide = {
        columns: ['Size', 'Waist', 'Hips', 'Length', 'Leg Opening', 'Rise'],
        rows: [],
        material: 'Cotton 100%'
      };
      setEditingProduct(null);
      setProdForm({
        name: '', slug: '', category: categories[0]?.slug || '', price: '', original_price: '',
        badge: '', image: '', images: [], size_guide: defaultSizeGuide, description: '', long_description: '',
        in_stock: true, sizes: 'S, M, L, XL', colors: 'Black, White', inventory_id: ''
      });
    }
    setIsProductModalOpen(true);
  };

  // Open Modal for Category Add/Edit
  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCatForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image_url: category.image_url || ''
      });
    } else {
      setEditingCategory(null);
      setCatForm({
        name: '', slug: '', description: '', image_url: ''
      });
    }
    setIsCategoryModalOpen(true);
  };

  // Save Product
  const saveProductSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    // Format tags arrays
    const formattedSizes = prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const formattedColors = prodForm.colors.split(',').map(c => c.trim()).filter(Boolean);

    const payload = {
      name: prodForm.name,
      slug: prodForm.slug,
      category: prodForm.category,
      price: Number(prodForm.price) || 0,
      original_price: prodForm.original_price ? Number(prodForm.original_price) : null,
      badge: prodForm.badge || null,
      image: prodForm.image,
      images: prodForm.images,
      size_guide: prodForm.size_guide,
      description: prodForm.description,
      long_description: prodForm.long_description,
      in_stock: prodForm.in_stock,
      sizes: formattedSizes,
      colors: formattedColors,
      inventory_id: prodForm.inventory_id || null,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload]);
        if (error) throw error;
      }
      setIsProductModalOpen(false);
      fetchStorefrontData();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Save Category
  const saveCategorySubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      name: catForm.name,
      slug: catForm.slug,
      description: catForm.description,
      image_url: catForm.image_url || null
    };

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([payload]);
        if (error) throw error;
      }
      setIsCategoryModalOpen(false);
      fetchStorefrontData();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchStorefrontData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This will not delete its products, but they will be uncategorized.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchStorefrontData();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Save Home Banner settings
  const handleSaveHomeSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'home_page',
          value: homeSettings,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      alert('Homepage customizer settings saved successfully!');
    } catch (err) {
      console.error('Error saving site settings:', err);
      alert('Failed to save home page settings: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="storefront-mgmt content-scrollable">
      
      {/* Elite Enterprise Header */}
      <div className="elite-enterprise-header">
        <div className="title-group-elite">
          <h1 className="premium-title-enterprise text-dark">
            Storefront <span className="text-accent-indigo">Management</span>
          </h1>
          <p className="premium-subtitle-enterprise">
            Control products, categories, collections, and custom banners in real time.
          </p>
        </div>

        <div className="header-actions-enterprise">
          {activeTab === 'products' && (
            <Button variant="primary" className="action-btn-green" onClick={() => openProductModal(null)}>
              <Plus size={16} /> Add Product
            </Button>
          )}
          {activeTab === 'categories' && (
            <Button variant="primary" className="action-btn-green" onClick={() => openCategoryModal(null)}>
              <Plus size={16} /> Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="sf-tabs-bar">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`sf-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={16} /> Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('categories')} 
          className={`sf-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
        >
          <Layers size={16} /> Categories ({categories.length})
        </button>
        <button 
          onClick={() => setActiveTab('banners')} 
          className={`sf-tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
        >
          <Sliders size={16} /> Banners & Sections
        </button>
      </div>

      {loading ? (
        <div className="sf-loader-container">
          <Loader2 size={36} className="sf-loader" />
        </div>
      ) : (
        <div className="sf-tab-content">
          
          {/* 1. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="sf-search-filters">
                <div className="search-input-wrapper flex-1">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search products by name or slug..." 
                    className="search-field"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="sf-select max-w-[200px]" 
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-surface-muted">
                  No products found matching filters.
                </div>
              ) : (
                <div className="sf-products-grid">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="sf-card">
                      <div className="sf-card-image-wrapper">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="sf-card-image" />
                        ) : (
                          <Package size={32} className="text-surface-muted" />
                        )}
                        {p.badge && <span className="sf-badge-pill">{p.badge}</span>}
                      </div>

                      <div className="sf-card-body">
                        <div className="sf-card-meta">
                          <span className="text-brand font-semibold">{p.category}</span>
                          {p.inventory_id ? (
                            <span className={p.inventory?.current_stock > 0 ? "text-green-500 font-bold animate-pulse" : "text-red-500 font-bold"}>
                              Stock: {p.inventory?.current_stock ?? 0}
                            </span>
                          ) : (
                            <span className={p.in_stock ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                              {p.in_stock ? "In Stock" : "Out of Stock"}
                            </span>
                          )}
                        </div>
                        <h3 className="sf-card-title">{p.name}</h3>
                        <p className="text-xs text-surface-muted truncate">/{p.slug}</p>
                        
                        <div className="sf-card-price-group">
                          <span className="sf-price-current">৳{p.price}</span>
                          {p.original_price && (
                            <span className="sf-price-original">৳{p.original_price}</span>
                          )}
                        </div>
                      </div>

                      <div className="sf-card-footer">
                        <Button variant="ghost" size="sm" onClick={() => openProductModal(p)}>
                          <Edit2 size={13} /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-500/10">
                          <Trash2 size={13} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="sf-categories-grid">
                {categories.map(c => (
                  <div key={c.id} className="sf-card">
                    <div className="sf-card-image-wrapper">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="sf-card-image" />
                      ) : (
                        <Layers size={32} className="text-surface-muted" />
                      )}
                    </div>
                    <div className="sf-card-body">
                      <h3 className="sf-card-title">{c.name}</h3>
                      <p className="text-xs text-surface-muted">slug: /{c.slug}</p>
                      <p className="text-sm text-surface-secondary mt-2 leading-relaxed line-clamp-2">{c.description || 'No description provided.'}</p>
                    </div>
                    <div className="sf-card-footer">
                      <Button variant="ghost" size="sm" onClick={() => openCategoryModal(c)}>
                        <Edit2 size={13} /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:bg-red-500/10">
                        <Trash2 size={13} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. BANNERS TAB (SITE CUSTOMIZER) */}
          {activeTab === 'banners' && (
            <div className="sf-banners-layout">
              {/* Sidebar */}
              <div className="sf-editor-sidebar">
                <button 
                  onClick={() => setBannerSection('hero')} 
                  className={`sf-sidebar-section-btn ${bannerSection === 'hero' ? 'active' : ''}`}
                >
                  Hero Banner
                </button>
                <button 
                  onClick={() => setBannerSection('drops')} 
                  className={`sf-sidebar-section-btn ${bannerSection === 'drops' ? 'active' : ''}`}
                >
                  Collections & Drops
                </button>
                <button 
                  onClick={() => setBannerSection('story')} 
                  className={`sf-sidebar-section-btn ${bannerSection === 'story' ? 'active' : ''}`}
                >
                  Brand Story
                </button>
                <button 
                  onClick={() => setBannerSection('instagram')} 
                  className={`sf-sidebar-section-btn ${bannerSection === 'instagram' ? 'active' : ''}`}
                >
                  Social / Instagram
                </button>
              </div>

              {/* Editor Card */}
              <div className="sf-editor-content-card">
                <form onSubmit={handleSaveHomeSettings} className="space-y-6">
                  
                  {/* Hero banner section */}
                  {bannerSection === 'hero' && (
                    <div className="space-y-4">
                      <h2 className="text-h3 font-black border-b border-base-800 pb-2">Hero Section Banner</h2>
                      <div className="sf-form-grid">
                        <div className="sf-form-group">
                          <label className="sf-label">Hero Badge</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.heroBadge}
                            onChange={(e) => setHomeSettings({ ...homeSettings, heroBadge: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Hero Sub-Badge</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.heroSubBadge}
                            onChange={(e) => setHomeSettings({ ...homeSettings, heroSubBadge: e.target.value })}
                          />
                        </div>
                        <ImageUploadInput
                          label="Hero Background Image URL"
                          value={homeSettings.heroBgImage}
                          onChange={(val) => setHomeSettings({ ...homeSettings, heroBgImage: val })}
                          placeholder="e.g. /images/hero-banner.webp"
                        />
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Hero Main Heading</label>
                          <textarea 
                            className="sf-textarea" 
                            value={homeSettings.heroHeading}
                            onChange={(e) => setHomeSettings({ ...homeSettings, heroHeading: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Hero Subtext description</label>
                          <textarea 
                            className="sf-textarea" 
                            value={homeSettings.heroSubtext}
                            onChange={(e) => setHomeSettings({ ...homeSettings, heroSubtext: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Hero Button CTA text</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.heroButtonText}
                            onChange={(e) => setHomeSettings({ ...homeSettings, heroButtonText: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Collections and Drops Section */}
                  {bannerSection === 'drops' && (
                    <div className="space-y-4">
                      <h2 className="text-h3 font-black border-b border-base-800 pb-2">Collections & Catalog Sections</h2>
                      <div className="sf-form-grid">
                        <div className="sf-form-group">
                          <label className="sf-label">Categories Section Sub-title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.collectionsLabel}
                            onChange={(e) => setHomeSettings({ ...homeSettings, collectionsLabel: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Categories Section Main Title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.collectionsTitle}
                            onChange={(e) => setHomeSettings({ ...homeSettings, collectionsTitle: e.target.value })}
                          />
                        </div>
                        
                        <div className="sf-form-group">
                          <label className="sf-label">New Arrivals Section Sub-title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.latestLabel}
                            onChange={(e) => setHomeSettings({ ...homeSettings, latestLabel: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">New Arrivals Section Title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.latestTitle}
                            onChange={(e) => setHomeSettings({ ...homeSettings, latestTitle: e.target.value })}
                          />
                        </div>

                        <div className="sf-form-group">
                          <label className="sf-label">Catalog Section Sub-title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.catalogLabel}
                            onChange={(e) => setHomeSettings({ ...homeSettings, catalogLabel: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Catalog Section Title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.catalogTitle}
                            onChange={(e) => setHomeSettings({ ...homeSettings, catalogTitle: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Catalog Subtext Description</label>
                          <textarea 
                            className="sf-textarea" 
                            value={homeSettings.catalogSubtext}
                            onChange={(e) => setHomeSettings({ ...homeSettings, catalogSubtext: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Brand Story Section */}
                  {bannerSection === 'story' && (
                    <div className="space-y-4">
                      <h2 className="text-h3 font-black border-b border-base-800 pb-2">Brand Story</h2>
                      <div className="sf-form-grid">
                        <div className="sf-form-group">
                          <label className="sf-label">Story Section Sub-title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.brandStoryLabel}
                            onChange={(e) => setHomeSettings({ ...homeSettings, brandStoryLabel: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Story Section Title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.brandStoryTitle}
                            onChange={(e) => setHomeSettings({ ...homeSettings, brandStoryTitle: e.target.value })}
                          />
                        </div>
                        <ImageUploadInput
                          label="Story Section Banner Image URL"
                          value={homeSettings.brandStoryImage}
                          onChange={(val) => setHomeSettings({ ...homeSettings, brandStoryImage: val })}
                          placeholder="e.g. /images/hoodie-rust.webp"
                        />
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Story Paragraph 1</label>
                          <textarea 
                            className="sf-textarea" 
                            value={homeSettings.brandStoryText1}
                            onChange={(e) => setHomeSettings({ ...homeSettings, brandStoryText1: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Story Paragraph 2</label>
                          <textarea 
                            className="sf-textarea" 
                            value={homeSettings.brandStoryText2}
                            onChange={(e) => setHomeSettings({ ...homeSettings, brandStoryText2: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instagram / Social section */}
                  {bannerSection === 'instagram' && (
                    <div className="space-y-4">
                      <h2 className="text-h3 font-black border-b border-base-800 pb-2">Social Feed & Instagram Channel</h2>
                      <div className="sf-form-grid">
                        <div className="sf-form-group">
                          <label className="sf-label">Instagram Section Sub-title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.instagramLabel}
                            onChange={(e) => setHomeSettings({ ...homeSettings, instagramLabel: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Instagram Section Title</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.instagramTitle}
                            onChange={(e) => setHomeSettings({ ...homeSettings, instagramTitle: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group full-width">
                          <label className="sf-label">Instagram URL / Profile link</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.instagramUrl}
                            onChange={(e) => setHomeSettings({ ...homeSettings, instagramUrl: e.target.value })}
                          />
                        </div>
                        <div className="sf-form-group">
                          <label className="sf-label">Instagram Subtext Description</label>
                          <input 
                            type="text" 
                            className="sf-input" 
                            value={homeSettings.instagramSubtext}
                            onChange={(e) => setHomeSettings({ ...homeSettings, instagramSubtext: e.target.value })}
                          />
                        </div>
                        <ImageUploadInput
                          label="Instagram Mini-profile Image URL"
                          value={homeSettings.instagramProfileImage}
                          onChange={(val) => setHomeSettings({ ...homeSettings, instagramProfileImage: val })}
                          placeholder="e.g. /images/hoodie-rust.webp"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="sf-form-actions">
                    <Button variant="primary" type="submit" disabled={saveLoading} className="action-btn-green">
                      {saveLoading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* PRODUCT MODAL */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-base-800 pb-3">
            <h2 className="text-h3 font-black">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <button className="btn-icon" onClick={() => setIsProductModalOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={saveProductSubmit} className="space-y-6">
            <div className="sf-form-grid">
              <div className="sf-form-group">
                <label className="sf-label">Product Name</label>
                <input 
                  type="text" 
                  className="sf-input" 
                  value={prodForm.name}
                  onChange={handleProdNameChange}
                  required 
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label flex justify-between items-center">
                  <span>URL Slug</span>
                  <span className="text-[10px] text-brand flex items-center gap-1 cursor-pointer" onClick={() => setProdForm({ ...prodForm, slug: generateSlug(prodForm.name) })}>
                    <Sparkles size={10} /> Auto
                  </span>
                </label>
                <input 
                  type="text" 
                  className="sf-input" 
                  value={prodForm.slug}
                  onChange={(e) => setProdForm({ ...prodForm, slug: generateSlug(e.target.value) })}
                  required 
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Category</label>
                <select 
                  className="sf-select" 
                  value={prodForm.category}
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Link to Inventory Item (Stock Sync)</label>
                <select 
                  className="sf-select" 
                  value={prodForm.inventory_id || ''}
                  onChange={(e) => setProdForm({ ...prodForm, inventory_id: e.target.value || '' })}
                >
                  <option value="">-- No Link (Ignore Stock Control) --</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku || 'No SKU'}) - Stock: {item.current_stock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Badge Tag (e.g. Bestseller, New, Drop)</label>
                <input 
                  type="text" 
                  className="sf-input" 
                  placeholder="Leave empty for none"
                  value={prodForm.badge}
                  onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Selling Price (BDT)</label>
                <input 
                  type="number" 
                  className="sf-input" 
                  value={prodForm.price}
                  onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                  required 
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Original/Strike Price (BDT)</label>
                <input 
                  type="number" 
                  className="sf-input" 
                  placeholder="Leave empty for no strike"
                  value={prodForm.original_price}
                  onChange={(e) => setProdForm({ ...prodForm, original_price: e.target.value })}
                />
              </div>

              <ImageUploadInput
                label="Product Main Image URL"
                value={prodForm.image}
                onChange={(val) => setProdForm({ ...prodForm, image: val })}
                placeholder="e.g. /images/hoodie-black.webp"
                required
              />

              <MultipleImageUploadInput
                label="Product Additional Images"
                value={prodForm.images || []}
                onChange={(urls) => setProdForm({ ...prodForm, images: urls })}
              />

              <SizeGuideTableEditor
                value={prodForm.size_guide}
                onChange={(guide) => setProdForm({ ...prodForm, size_guide: guide })}
              />

              <div className="sf-form-group">
                <label className="sf-label">Available Sizes (comma separated)</label>
                <input 
                  type="text" 
                  className="sf-input" 
                  placeholder="e.g. S, M, L, XL"
                  value={prodForm.sizes}
                  onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Available Colors (comma separated)</label>
                <input 
                  type="text" 
                  className="sf-input" 
                  placeholder="e.g. black, rust, grey"
                  value={prodForm.colors}
                  onChange={(e) => setProdForm({ ...prodForm, colors: e.target.value })}
                />
              </div>

              <div className="sf-form-group full-width">
                <label className="sf-label">Short Description</label>
                <textarea 
                  className="sf-textarea" 
                  placeholder="Describe this product briefly..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="sf-form-group full-width">
                <label className="sf-label">Long Details Description</label>
                <textarea 
                  className="sf-textarea" 
                  placeholder="Provide detailed composition, sizing details etc..."
                  value={prodForm.long_description}
                  onChange={(e) => setProdForm({ ...prodForm, long_description: e.target.value })}
                  required
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label">Stock Status</label>
                <div className="sf-toggle-group">
                  <label className="sf-switch">
                    <input 
                      type="checkbox" 
                      checked={prodForm.in_stock}
                      onChange={(e) => setProdForm({ ...prodForm, in_stock: e.target.checked })}
                    />
                    <span className="sf-slider"></span>
                  </label>
                  <span className="text-sm font-semibold">{prodForm.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>

            <div className="sf-form-actions">
              <Button variant="ghost" type="button" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={saveLoading} className="action-btn-green">
                {saveLoading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Product
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-base-800 pb-3">
            <h2 className="text-h3 font-black">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <button className="btn-icon" onClick={() => setIsCategoryModalOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={saveCategorySubmit} className="space-y-6">
            <div className="sf-form-grid">
              <div className="sf-form-group">
                <label className="sf-label">Category Name</label>
                <input 
                  type="text" 
                  className="sf-input" 
                  value={catForm.name}
                  onChange={handleCatNameChange}
                  required 
                />
              </div>

              <div className="sf-form-group">
                <label className="sf-label flex justify-between items-center">
                  <span>URL Slug</span>
                  <span className="text-[10px] text-brand flex items-center gap-1 cursor-pointer" onClick={() => setCatForm({ ...catForm, slug: generateSlug(catForm.name) })}>
                    <Sparkles size={10} /> Auto
                  </span>
                </label>
                <input 
                  type="text" 
                  className="sf-input" 
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: generateSlug(e.target.value) })}
                  required 
                />
              </div>

              <ImageUploadInput
                label="Category Image URL"
                value={catForm.image_url}
                onChange={(val) => setCatForm({ ...catForm, image_url: val })}
                placeholder="e.g. /images/cat-hoodies.webp"
              />

              <div className="sf-form-group full-width">
                <label className="sf-label">Description</label>
                <textarea 
                  className="sf-textarea" 
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="sf-form-actions">
              <Button variant="ghost" type="button" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={saveLoading} className="action-btn-green">
                {saveLoading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Category
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
};
export default StorefrontManagement;
