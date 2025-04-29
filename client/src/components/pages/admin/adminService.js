import api from '../../../utils/api';

// New function to fetch all pet owners from the admin endpoint
export const getAllPetOwners = async () => {
  try {
    const response = await api.get('/admin/pet-owners');
    return response.data;
  } catch (error) {
    console.error('Error fetching pet owners:', error);
    throw error;
  }
};

// New function to fetch user statistics from the admin endpoint
export const getUserStats = async () => {
  try {
    const response = await api.get('/admin/statistics/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

// New function to fetch pet statistics from the admin endpoint
export const getPetStats = async () => {
  try {
    const response = await api.get('/admin/statistics/pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching pet statistics:', error);
    throw error;
  }
};