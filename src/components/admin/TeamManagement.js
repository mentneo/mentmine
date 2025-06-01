import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { FaEdit, FaTrash, FaUserAlt, FaSpinner, FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa';

function TeamManagement() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedType, setSelectedType] = useState('mentors');
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    type: 'mentors',
    imageUrl: '',
    order: 0,
    linkedin: '',
    twitter: '',
    website: '',
    email: '',
    phone: '',
    specialization: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const teamTypes = [
    { id: 'mentors', label: 'Mentors' },
    { id: 'experts', label: 'Industry Experts' },
    { id: 'alumni', label: 'Alumni' }
  ];

  useEffect(() => {
    fetchTeam();
  }, [selectedType]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const teamQuery = query(
        collection(db, 'team'),
        where('type', '==', selectedType),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(teamQuery);
      const teamList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTeam(teamList);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'order' ? parseInt(value) : value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      type: selectedType,
      imageUrl: '',
      order: team.length + 1,
      linkedin: '',
      twitter: '',
      website: '',
      email: '',
      phone: '',
      specialization: '',
      featured: false
    });
    setImageFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      title: member.title || '',
      bio: member.bio || '',
      type: member.type || selectedType,
      imageUrl: member.imageUrl || '',
      order: member.order || 0,
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      website: member.website || '',
      email: member.email || '',
      phone: member.phone || '',
      specialization: member.specialization || '',
      featured: member.featured || false
    });
    setImageFile(null);
    setUploadProgress(0);
    setModalOpen(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    
    try {
      await deleteDoc(doc(db, 'team', memberId));
      setTeam(team.filter(member => member.id !== memberId));
      alert("Team member deleted successfully");
    } catch (err) {
      console.error("Error deleting team member:", err);
      alert("Failed to delete team member");
    }
  };

  const handleMoveUp = async (member, index) => {
    if (index === 0) return; // Already first
    
    const prevMember = team[index - 1];
    const newOrder = prevMember.order;
    const prevOrder = member.order;
    
    try {
      // Update current member
      await updateDoc(doc(db, 'team', member.id), {
        order: newOrder
      });
      
      // Update previous member
      await updateDoc(doc(db, 'team', prevMember.id), {
        order: prevOrder
      });
      
      // Update local state
      let updatedTeam = [...team];
      updatedTeam[index].order = newOrder;
      updatedTeam[index - 1].order = prevOrder;
      updatedTeam.sort((a, b) => a.order - b.order);
      
      setTeam(updatedTeam);
    } catch (err) {
      console.error("Error reordering members:", err);
      alert("Failed to change order");
    }
  };

  const handleMoveDown = async (member, index) => {
    if (index === team.length - 1) return; // Already last
    
    const nextMember = team[index + 1];
    const newOrder = nextMember.order;
    const nextOrder = member.order;
    
    try {
      // Update current member
      await updateDoc(doc(db, 'team', member.id), {
        order: newOrder
      });
      
      // Update next member
      await updateDoc(doc(db, 'team', nextMember.id), {
        order: nextOrder
      });
      
      // Update local state
      let updatedTeam = [...team];
      updatedTeam[index].order = newOrder;
      updatedTeam[index + 1].order = nextOrder;
      updatedTeam.sort((a, b) => a.order - b.order);
      
      setTeam(updatedTeam);
    } catch (err) {
      console.error("Error reordering members:", err);
      alert("Failed to change order");
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      const storageRef = ref(storage, `team/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new one is selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      const memberData = {
        ...formData,
        imageUrl,
        updatedAt: serverTimestamp()
      };
      
      if (selectedMember) {
        // Update existing team member
        await updateDoc(doc(db, 'team', selectedMember.id), memberData);
        alert("Team member updated successfully");
      } else {
        // Add new team member
        memberData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'team'), memberData);
        alert("Team member added successfully");
      }
      
      setModalOpen(false);
      fetchTeam();
    } catch (err) {
      console.error("Error saving team member:", err);
      alert("Error saving team member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">Team Management</h2>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {teamTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddMember}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Member
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {team.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">{member.order}</span>
                        <div className="flex flex-col">
                          <button 
                            onClick={() => handleMoveUp(member, index)}
                            disabled={index === 0}
                            className={`text-xs ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            <FaArrowUp />
                          </button>
                          <button 
                            onClick={() => handleMoveDown(member, index)}
                            disabled={index === team.length - 1}
                            className={`text-xs ${index === team.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                        {member.featured && (
                          <FaStar className="text-yellow-500 ml-1" title="Featured" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.imageUrl ? (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              src={member.imageUrl} 
                              alt={member.name}
                              className="h-10 w-10 rounded-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaUserAlt className="text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          {member.specialization && (
                            <div className="text-xs text-gray-500">{member.specialization}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600">{member.title || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.email && (
                        <div className="text-sm text-gray-900 truncate">{member.email}</div>
                      )}
                      {member.phone && (
                        <div className="text-sm text-gray-500">{member.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No team members found in this category. Add your first one!
            </div>
          )}
        </div>
      )}
      
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title/Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="e.g., Senior Developer, Instructor, etc."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Frontend Development, Cloud Computing, etc."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    {formData.imageUrl && (
                      <div className="mb-2">
                        <img src={formData.imageUrl} alt="Profile" className="h-32 w-auto object-cover rounded-md" />
                      </div>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Featured Member (will be highlighted)
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Member Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {teamTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        id="order"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      `${selectedMember ? 'Update' : 'Add'} Team Member`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
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
  );
}

export default TeamManagement;
