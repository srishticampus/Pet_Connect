import api from '../../../utils/api';

export const getAllPets = async () => {
  try {
    const response = await api.get('/admin/pets');
    let pets = response.data;
    pets = pets.map((pet, idx) => {
      pet.id = idx + 1;
      return pet;
    });
    return pets;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const addPet = async (petData) => {
  try {
    const response = await api.post('/admin/pets', petData);
    return response.data;
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (id, petData) => {
  try {
    const response = await api.put(`/admin/pets/${id}`, petData);
    return response.data;
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
};

export const deletePet = async (id) => {
  try {
    const response = await api.delete(`/admin/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};