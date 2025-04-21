import api from '../../../utils/api';

export const getAllPetOwners = async () => {
  try {
    const response = await api.get('/api/admin/pet-owners');
    return response.data;
  } catch (error) {
    console.error('Error fetching pet owners:', error);
    throw error;
  }
};

export const addPetOwner = async (petOwnerData) => {
  try {
    const response = await api.post('/api/admin/pet-owners', petOwnerData);
    return response.data;
  } catch (error) {
    console.error('Error adding pet owner:', error);
    throw error;
  }
};

export const updatePetOwner = async (id, petOwnerData) => {
  try {
    const response = await api.put(`/api/admin/pet-owners/${id}`, petOwnerData);
    return response.data;
  } catch (error) {
    console.error('Error updating pet owner:', error);
    throw error;
  }
};