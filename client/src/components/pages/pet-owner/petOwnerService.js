import api from '@/utils/api';

const petOwnerService = {
  getLostPets: async () => {
    try {
      const response = await api.get('/pet-owner/lost-pets');
      return response.data;
    } catch (error) {
      console.error('Error fetching lost pets:', error);
      throw error;
    }
  },

  getLostPetById: async (petId) => {
    try {
      const response = await api.get(`/pet-owner/lost-pets/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lost pet with ID ${petId}:`, error);
      throw error;
    }
  },


  addLostPet: async (petData) => {
    try {
      const response = await api.post('/pet-owner/lost-pets', petData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending FormData
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding lost pet:', error);
      throw error;
    }
  },

  editLostPet: async (petId, petData) => {
    try {
      const response = await api.put(`/pet-owner/lost-pets/${petId}`, petData);
      return response.data;
    } catch (error) {
      console.error('Error editing lost pet:', error);
      throw error;
    }
  },

  markPetAsFound: async (petId) => {
    try {
      const response = await api.patch(`/pet-owner/lost-pets/${petId}/found`);
      return response.data;
    } catch (error) {
      console.error('Error marking pet as found:', error);
      throw error;
    }
  },
};

export default petOwnerService;