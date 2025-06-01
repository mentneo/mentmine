import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { AdminLayout } from '../../components/admin';
import { FaUserPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
    isActive: true,
    order: 0,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Load team members
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  // Fetch team members directly without complex queries
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use a simple fetch without complex queries
      const teamCollection = collection(db, 'team');
      const snapshot = await getDocs(teamCollection);
      
      if (snapshot.empty) {
        console.log('No team members found');
        setMembers([]);
        return;
      }
      
      const teamData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort client-side
      teamData.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      setMembers(teamData);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError(`Failed to load team members: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Open modal for new team member
  const handleAddNew = () => {
    setCurrentMember({
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      isActive: true,
      order: members.length + 1,
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
    setIsEditing(false);
    setShowModal(true);
  };
  
  // Open modal for editing
  const handleEdit = (member) => {
    setCurrentMember({
      id: member.id,
      name: member.name || '',
      position: member.position || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      isActive: member.isActive !== false,
      order: member.order || 0,
      socialLinks: member.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
    setIsEditing(true);
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social_')) {
      // Handle social links
      const socialType = name.replace('social_', '');
      setCurrentMember(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialType]: value
        }
      }));
    } else {
      // Handle regular inputs
      setCurrentMember(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Toggle member active status
  const handleToggleActive = async (member) => {
    try {
      await updateDoc(doc(db, 'team', member.id), {
        isActive: !member.isActive,
        updatedAt: serverTimestamp()
      });
      
      fetchTeamMembers();
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert(`Error: ${err.message}`);
    }
  };
  
  // Save team member
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (!currentMember.name || !currentMember.position) {
        alert("Name and position are required");
        return;
      }
      
      if (isEditing && currentMember.id) {
        // Update existing member
        const memberRef = doc(db, 'team', currentMember.id);
        await updateDoc(memberRef, {
          ...currentMember,
          updatedAt: serverTimestamp()
        });
        alert(`Team member "${currentMember.name}" updated successfully`);
      } else {
        // Add new member
        await addDoc(collection(db, 'team'), {
          ...currentMember,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert(`Team member "${currentMember.name}" added successfully`);
      }
      
      // Close modal and refresh list
      setShowModal(false);
      fetchTeamMembers();
    } catch (err) {
      console.error("Error saving team member:", err);
      alert(`Error: ${err.message}`);
    }
  };
  
  // Delete team member
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'team', id));
      alert(`Team member "${name}" deleted successfully`);
      fetchTeamMembers();
    } catch (err) {
      console.error("Error deleting team member:", err);
      alert(`Error: ${err.message}`);
    }
  };
  
  // If we're having issues loading team members, show a simplified UI
  if (error) {
    return (
      <AdminLayout>
        <div className="bg-white shadow-md rounded p-6">
          <h1 className="text-2xl font-bold mb-6">Team Management</h1>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchTeamMembers} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Manual Team Member Creation</h2>
            <p className="mb-4">If you're having issues with the team listing, you can still add a new team member:</p>
            <button 
              onClick={handleAddNew}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaUserPlus className="mr-2" /> Add New Team Member
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FaUserPlus className="mr-2" /> Add Team Member
          </button>
        </div>
        
        {/* Admin notification about Git repository issues */}
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
          <h3 className="font-bold">Developer Notice</h3>
          <p>If you're experiencing Git push issues with large files, try these commands in terminal:</p>
          <div className="bg-gray-800 text-white p-3 mt-2 rounded text-sm overflow-x-auto">
            <pre>
              {`# Make scripts executable
chmod +x cleanup-git.sh
chmod +x simple-cleanup.sh

# Run the simple cleanup script
./simple-cleanup.sh`}
            </pre>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No team members found</p>
            <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Add Your First Team Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Position</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Order</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4">
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name} 
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='100%' height='100%' fill='%23f1f1f1'/%3E%3Ctext x='50%' y='50%' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E?%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                          <FaUser className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {member.name}
                    </td>
                    <td className="py-2 px-4">
                      {member.position}
                    </td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => handleToggleActive(member)}
                        className={`py-1 px-3 rounded-full text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      {member.order}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id, member.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {isEditing ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={handleSave}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={currentMember.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={currentMember.position}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={currentMember.bio}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={currentMember.imageUrl}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      placeholder="https://example.com/image.jpg"
                    />
                    {currentMember.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={currentMember.imageUrl}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={currentMember.order}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      min="0"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Social Links</label>
                    
                    <div className="space-y-2">
                      <input
                        type="url"
                        name="social_linkedin"
                        value={currentMember.socialLinks?.linkedin || ''}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        placeholder="LinkedIn URL"
                      />
                      
                      <input
                        type="url"
                        name="social_twitter"
                        value={currentMember.socialLinks?.twitter || ''}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        placeholder="Twitter URL"
                      />
                      
                      <input
                        type="url"
                        name="social_github"
                        value={currentMember.socialLinks?.github || ''}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        placeholder="GitHub URL"
                      />
                      
                      <input
                        type="url"
                        name="social_website"
                        value={currentMember.socialLinks?.website || ''}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                        placeholder="Personal Website URL"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6 flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={currentMember.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Visible on website</label>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                      <FaSave className="mr-2" /> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default TeamManagement;
