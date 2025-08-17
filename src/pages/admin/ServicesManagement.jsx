
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Button from '../../components/ui/Button';
import { SERVICES_COLLECTION } from '../../constants/services';
import { simpleUpload } from '../../utils/cloudinary';
import { DEFAULT_SERVICE_IMAGES } from '../../constants/defaultServiceImages';

const initialForm = {
  name: '',
  description: '',
  imageUrl: '',
};

const ServicesManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch services
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, SERVICES_COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // If no services, add dummy data
        if (data.length === 0) {
          const dummy = [
            { name: 'Websites', description: 'Custom website design and development.' },
            { name: 'Web Apps', description: 'Modern web application solutions.' },
            { name: 'iOS/Android Apps', description: 'Mobile app development for iOS and Android.' },
            { name: 'Cyber Security', description: 'Security audits and protection services.' },
            { name: 'Digital Marketing', description: 'SEO, SEM, and online marketing.' },
            { name: 'Editing', description: 'Professional video and photo editing.' },
          ];
          for (const s of dummy) {
            await addDoc(collection(db, SERVICES_COLLECTION), { ...s, createdAt: new Date(), updatedAt: new Date() });
          }
          const snap = await getDocs(q);
          data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        // Assign default images to services without images
        let updated = false;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].imageUrl) {
            data[i].imageUrl = DEFAULT_SERVICE_IMAGES[i % DEFAULT_SERVICE_IMAGES.length];
            await updateDoc(doc(db, SERVICES_COLLECTION, data[i].id), { imageUrl: data[i].imageUrl });
            updated = true;
          }
        }
        if (updated) {
          const snap = await getDocs(q);
          data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        setItems(data);
      } catch (err) {
        setError('Failed to load services.');
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Add or update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        const uploadRes = await simpleUpload(imageFile);
        imageUrl = uploadRes.url;
      }
      const data = {
        name: form.name,
        description: form.description,
        imageUrl,
        updatedAt: new Date(),
      };
      if (editingId) {
        await updateDoc(doc(db, SERVICES_COLLECTION, editingId), data);
        setItems(items => items.map(item => item.id === editingId ? { ...item, ...data } : item));
      } else {
        const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
          ...data,
          createdAt: new Date(),
        });
        setItems(items => [{ id: docRef.id, ...data, createdAt: new Date() }, ...items]);
      }
      setForm(initialForm);
      setEditingId(null);
      setImageFile(null);
    } catch (err) {
      setError('Failed to save service.');
    } finally {
      setUploading(false);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setForm({
      name: item.name || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
    });
    setEditingId(item.id);
    setImageFile(null);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteDoc(doc(db, SERVICES_COLLECTION, id));
      setItems(items => items.filter(item => item.id !== id));
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
    } catch (err) {
      setError('Failed to delete service.');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Services</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Service' : 'Add Service'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Service Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {form.imageUrl && !imageFile && (
              <img src={form.imageUrl} alt="Service" className="mt-2 h-20 rounded" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" size="sm" disabled={uploading}>
              {uploading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
            </Button>
            {editingId && (
              <Button type="button" onClick={handleCancel} size="sm" variant="secondary">Cancel</Button>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-24 w-full object-cover rounded mb-2" />}
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
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

export default ServicesManagement;
