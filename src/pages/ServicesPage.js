

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components';
import { db } from '../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SERVICES_COLLECTION } from '../constants/services';
import { DEFAULT_SERVICE_IMAGES } from '../constants/defaultServiceImages';

function ServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, SERVICES_COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>
        <p className="text-lg text-gray-700 mb-8">Explore the services we offer.</p>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-400">No services listed yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => {
              const imageUrl = item.imageUrl || DEFAULT_SERVICE_IMAGES[idx % DEFAULT_SERVICE_IMAGES.length];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col cursor-pointer hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-400"
                  onClick={() => navigate('/contact')}
                  title="Click to inquire about this service"
                >
                  {imageUrl && (
                    <img src={imageUrl} alt={item.name} className="h-32 w-full object-cover rounded mb-3" />
                  )}
                  <h3 className="font-bold text-xl mb-2 text-blue-900">{item.name}</h3>
                  <p className="text-gray-600 mb-2 flex-1">{item.description}</p>
                  <span className="text-blue-600 text-sm mt-2">Contact us &rarr;</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ServicesPage;
