import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetch all team members from Firestore
 * @param {Object} options - Options for filtering and sorting
 * @returns {Promise<Array>} - Array of team members
 */
export const fetchTeamMembers = async (options = {}) => {
  const { activeOnly = false, sortBy = 'order' } = options;
  
  try {
    console.log("Fetching team members...");
    const teamSnapshot = await getDocs(collection(db, 'team'));
    
    let members = teamSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Fetched ${members.length} team members from Firestore`);
    
    // Filter for active members if requested
    if (activeOnly) {
      members = members.filter(member => member.isActive !== false);
      console.log(`After filtering for active: ${members.length} members`);
    }
    
    // Sort members
    if (sortBy === 'order') {
      members.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    } else if (sortBy === 'name') {
      members.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    
    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw new Error("Failed to load team members");
  }
};

/**
 * Add a new team member to Firestore
 * @param {Object} memberData - Team member data
 * @returns {Promise<string>} - ID of the newly created team member
 */
export const addTeamMember = async (memberData) => {
  try {
    const dataWithTimestamp = {
      ...memberData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'team'), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error adding team member:", error);
    throw new Error("Failed to add team member");
  }
};

/**
 * Update an existing team member in Firestore
 * @param {string} id - Team member ID
 * @param {Object} memberData - Updated team member data
 * @returns {Promise<void>}
 */
export const updateTeamMember = async (id, memberData) => {
  try {
    const dataWithTimestamp = {
      ...memberData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, 'team', id), dataWithTimestamp);
  } catch (error) {
    console.error("Error updating team member:", error);
    throw new Error("Failed to update team member");
  }
};

/**
 * Delete a team member from Firestore
 * @param {string} id - Team member ID
 * @returns {Promise<void>}
 */
export const deleteTeamMember = async (id) => {
  try {
    await deleteDoc(doc(db, 'team', id));
  } catch (error) {
    console.error("Error deleting team member:", error);
    throw new Error("Failed to delete team member");
  }
};

export default {
  fetchTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember
};
