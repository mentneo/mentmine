import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

function Team({ teamType = 'mentors', limit = 4 }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const teamTypeLabels = {
    mentors: 'Expert Mentors',
    alumni: 'Successful Alumni',
    experts: 'Industry Experts'
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        
        const teamQuery = query(
          collection(db, 'team'),
          where('type', '==', teamType),
          orderBy('order', 'asc'),
          limit ? limit : 100
        );
        
        const teamSnapshot = await getDocs(teamQuery);
        const teamList = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTeam(teamList);
      } catch (err) {
        console.error(`Error fetching ${teamType}:`, err);
        setError(`Failed to load ${teamTypeLabels[teamType]}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeam();
  }, [teamType, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (team.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600">No {teamTypeLabels[teamType].toLowerCase()} available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {team.map(member => (
        <div 
          key={member.id} 
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          data-aos="fade-up"
        >
          <div className="h-64 overflow-hidden">
            <img 
              src={member.imageUrl || '/default-avatar.png'} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
            <p className="text-blue-600 mb-2">{member.title}</p>
            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{member.bio}</p>
            
            <div className="flex space-x-3">
              {member.linkedin && (
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:text-blue-600"
                >
                  <FaLinkedin size={18} />
                </a>
              )}
              {member.twitter && (
                <a 
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                >
                  <FaTwitter size={18} />
                </a>
              )}
              {member.website && (
                <a 
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600"
                >
                  <FaGlobe size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Team;
