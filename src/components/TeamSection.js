import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaUser } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        console.log("Fetching team members...");
        // Simple approach to fetch team members
        const teamSnapshot = await getDocs(collection(db, 'team'));
        
        if (teamSnapshot.empty) {
          console.log("No team members found");
          setTeamMembers([]);
          return;
        }
        
        // Process and filter the data client-side
        const members = teamSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(member => member.isActive !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        
        console.log(`Found ${members.length} active team members`);
        setTeamMembers(members);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // If there are no team members or there was an error, don't display the section
  if ((teamMembers.length === 0 || error) && !loading) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Expert Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented professionals behind Mentneo's success
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6 text-center">
                  <div className="mb-4 mx-auto rounded-full overflow-hidden h-32 w-32 shadow-md">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-500 text-4xl" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  )}
                  
                  <div className="flex justify-center space-x-3">
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600">
                        <FaLinkedin size={18} />
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400">
                        <FaTwitter size={18} />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
                        <FaGithub size={18} />
                      </a>
                    )}
                    {member.socialLinks?.website && (
                      <a href={member.socialLinks.website} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-purple-600">
                        <FaGlobe size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamSection;
