import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { AdminLayout } from '../../components/admin';
import SimpleImageUploader from '../../components/admin/SimpleImageUploader';
import { FaUserPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSortUp, FaSortDown } from 'react-icons/fa';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  // Form data for new/editing team member
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    imageUrl: '',
    order: 0,
    isActive: true,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
    },
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const teamSnapshot = await getDocs(collection(db, 'team'));
      const members = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by order
      members.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setTeamMembers(members);
      setError(null);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    // Set default values
    setFormData({
      name: '',
      position: '',
      bio: '',
      imageUrl: '',
      order: teamMembers.length + 1,
      isActive: true,
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
      },
    });
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member.id);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      order: member.order || 0,
      isActive: member.isActive !== false, // default to true if undefined
      socialLinks: member.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
      },
    });
    setShowModal(true);
  };

  const handleImageUploaded = (imageData) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: imageData.url
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position) {
      alert("Name and position are required");
      return;
    }
    
    try {
      if (editingMember) {
        // Update existing team member
        await updateDoc(doc(db, 'team', editingMember), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        alert("Team member updated successfully!");
      } else {
        // Add new team member
        await addDoc(collection(db, 'team'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert("New team member added successfully!");
      }
      
      setShowModal(false);
      fetchTeamMembers();
    } catch (err) {
      console.error("Error saving team member:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'team', id));
      alert("Team member deleted successfully!");
      fetchTeamMembers();
    } catch (err) {
      console.error("Error deleting team member:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const toggleActive = async (member) => {
    try {
      await updateDoc(doc(db, 'team', member.id), {
        isActive: !member.isActive,
        updatedAt: serverTimestamp()
      });
      fetchTeamMembers();
    } catch (err) {
      console.error("Error toggling active status:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const moveOrder = async (member, direction) => {
    const currentIndex = teamMembers.findIndex(m => m.id === member.id);
    if (direction === 'up' && currentIndex > 0) {
      const targetMember = teamMembers[currentIndex - 1];
      try {
        // Swap orders
        await updateDoc(doc(db, 'team', member.id), { 
          order: targetMember.order,
          updatedAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'team', targetMember.id), { 
          order: member.order,
          updatedAt: serverTimestamp()
        });
        fetchTeamMembers();
      } catch (err) {
        console.error("Error reordering:", err);
        alert(`Error: ${err.message}`);
      }
    } else if (direction === 'down' && currentIndex < teamMembers.length - 1) {
      const targetMember = teamMembers[currentIndex + 1];
      try {
        // Swap orders
        await updateDoc(doc(db, 'team', member.id), { 
          order: targetMember.order,
          updatedAt: serverTimestamp() 
        });
        await updateDoc(doc(db, 'team', targetMember.id), { 
          order: member.order,
          updatedAt: serverTimestamp()
        });
        fetchTeamMembers();
      } catch (err) {
        console.error("Error reordering:", err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaUserPlus className="mr-2" /> Add Team Member
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-gray-500">No team members found. Add your first team member!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {member.imageUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={member.imageUrl}
                            alt={member.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {member.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(member)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {member.isActive ? (
                          <><FaEye className="mr-1" /> Active</>
                        ) : (
                          <><FaEyeSlash className="mr-1" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{member.order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveOrder(member, 'up')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaSortUp />
                          </button>
                          <button
                            onClick={() => moveOrder(member, 'down')}
                            className="text-gray-500 hover:text-gray-700 -mt-1"
                          >
                            <FaSortDown />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(member)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingMember ? "Edit Team Member" : "Add Team Member"}
                    </h3>
                    
                    <div className="space-y-4">
                      <SimpleImageUploader 
                        label="Profile Image" 
                        currentImage={formData.imageUrl}
                        onImageUploaded={handleImageUploaded}
                      />
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                          Position *
                        </label>
                        <input
                          type="text"
                          name="position"
                          id="position"
                          required
                          value={formData.position}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows="3"
                          value={formData.bio}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                          Display Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          id="order"
                          value={formData.order}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                          Social Media Links
                        </legend>
                        
                        <div className="space-y-2">
                          <div>
                            <label htmlFor="social_linkedin" className="sr-only">LinkedIn</label>
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                <FaLinkedin />
                              </span>
                              <input
                                type="url"
                                name="social_linkedin"
                                id="social_linkedin"
                                placeholder="LinkedIn URL"
                                value={formData.socialLinks?.linkedin || ''}
                                onChange={handleChange}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 border"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="social_twitter" className="sr-only">Twitter</label>
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                <FaTwitter />
                              </span>
                              <input
                                type="url"
                                name="social_twitter"
                                id="social_twitter"
                                placeholder="Twitter URL"
                                value={formData.socialLinks?.twitter || ''}
                                onChange={handleChange}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 border"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="social_github" className="sr-only">GitHub</label>
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                <FaGithub />
                              </span>
                              <input
                                type="url"
                                name="social_github"
                                id="social_github"
                                placeholder="GitHub URL"
                                value={formData.socialLinks?.github || ''}
                                onChange={handleChange}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 border"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="social_website" className="sr-only">Website</label>
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                🌐
                              </span>
                              <input
                                type="url"
                                name="social_website"
                                id="social_website"
                                placeholder="Website URL"
                                value={formData.socialLinks?.website || ''}
                                onChange={handleChange}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 border"
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active (Visible on website)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {editingMember ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
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
};

export default TeamManagement;
