
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { simpleUpload } from '../../utils/cloudinary';
import Button from '../../components/ui/Button';
import { PORTFOLIO_COLLECTION } from '../../constants/portfolio';

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  link: '',
};

const PortfolioManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch portfolio items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, PORTFOLIO_COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to load portfolio items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Add or update portfolio item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        const uploadRes = await simpleUpload(imageFile);
        imageUrl = uploadRes.url;
      }
      const data = {
        title: form.title,
        description: form.description,
        imageUrl,
        link: form.link,
        updatedAt: new Date(),
      };
      if (editingId) {
        await updateDoc(doc(db, PORTFOLIO_COLLECTION, editingId), data);
        setItems(items => items.map(item => item.id === editingId ? { ...item, ...data } : item));
      } else {
        const docRef = await addDoc(collection(db, PORTFOLIO_COLLECTION), {
          ...data,
          createdAt: new Date(),
        });
        setItems(items => [{ id: docRef.id, ...data, createdAt: new Date() }, ...items]);
      }
      setForm(initialForm);
      setEditingId(null);
      setImageFile(null);
    } catch (err) {
      setError('Failed to save portfolio item.');
    } finally {
      setUploading(false);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      link: item.link || '',
    });
    setEditingId(item.id);
    setImageFile(null);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await deleteDoc(doc(db, PORTFOLIO_COLLECTION, id));
      setItems(items => items.filter(item => item.id !== id));
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setImageFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Portfolio</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Link (optional)</label>
            <input type="url" name="link" value={form.link} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {form.imageUrl && !imageFile && (
              <img src={form.imageUrl} alt="Portfolio" className="mt-2 h-20 rounded" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" disabled={uploading} size="sm">
              {uploading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
            </Button>
            {editingId && (
              <Button type="button" onClick={handleCancel} size="sm" variant="secondary">Cancel</Button>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Items</h2>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">No portfolio items found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-cover rounded mb-2" />}
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-2">View Project</a>}
                <div className="mt-auto flex gap-2">
                  <Button size="xs" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button size="xs" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManagement;
