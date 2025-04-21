import api from '../../../utils/api';

export const getAllPetOwners = async () => {
  try {
    const response = await api.get('/admin/pet-owners');
    let petOwners = response.data;
    petOwners = petOwners.map((petOwner,idx) => {
      petOwner.id = idx+1;
      return petOwner;
    });
    return petOwners;
  } catch (error) {
    console.error('Error fetching pet owners:', error);
    throw error;
  }
};

export const addPetOwner = async (petOwnerData) => {
  try {
    const response = await api.post('/admin/pet-owners', petOwnerData);
    return response.data;
  } catch (error) {
    console.error('Error adding pet owner:', error);
    throw error;
  }
};

export const updatePetOwner = async (id, petOwnerData) => {
  try {
    const response = await api.put(`/admin/pet-owners/${id}`, petOwnerData);
    return response.data;
  } catch (error) {
    console.error('Error updating pet owner:', error);
    throw error;
  }
};

export const deletePetOwner = async (id) => {
  try {
    const response = await api.delete(`/admin/pet-owners/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pet owner:", error);
    throw error;
  }
};