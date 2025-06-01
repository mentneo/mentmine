import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Function to fetch team members from Firestore
 * @returns {Promise<Array>} Array of team members
 */
export async function getTeamMembers() {
  try {
    // Use a simple approach to fetch all team members
    const snapshot = await getDocs(collection(db, 'team'));
    
    if (snapshot.empty) {
      console.log('No team members found in database');
      return [];
    }
    
    // Process the data
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Fetched ${members.length} team members from database`);
    
    // Filter active members
    const activeMembers = members.filter(member => member.isActive !== false);
    console.log(`${activeMembers.length} active members after filtering`);
    
    // Sort by order property
    activeMembers.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    
    return activeMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to load team data');
  }
}

export default {
  getTeamMembers
};
