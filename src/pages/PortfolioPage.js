
import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '../components';
import { db } from '../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { PORTFOLIO_COLLECTION } from '../constants/portfolio';

function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, PORTFOLIO_COLLECTION), orderBy('createdAt', 'desc'));
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
        <h1 className="text-4xl font-bold mb-8 text-center">Design Portfolio</h1>
        <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl mx-auto">Showcase of our best work and student projects. Explore our creative designs and studio projects below.</p>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-400">No portfolio items yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                {item.imageUrl && (
                  <div className="h-56 w-full overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-2xl mb-2 text-gray-900 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{item.description}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-blue-600 hover:underline font-medium">View Project</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PortfolioPage;
