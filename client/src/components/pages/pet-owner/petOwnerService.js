import api from '@/utils/api';

const petOwnerService = {
  getLostFoundReportsForPetOwner: async () => {
    try {
      const response = await api.get('/pet-owner/lost-found-reports');
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
  deletePet: async (petId) => {
    try {
      const response = await api.delete(`/pet-owner/my-pets/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pet with ID ${petId}:`, error);
      throw error;
    }
  },
  getPetById: async (petId) => {
    try {
      const response = await api.get(`/pet-owner/my-pets/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pet with ID ${petId}:`, error);
      throw error;
    }
  },

  updatePet: async (petId, petData) => {
    try {
      const response = await api.put(`/pet-owner/my-pets/${petId}`, petData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending FormData
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating pet with ID ${petId}:`, error);
      throw error;
    }
  },
};

export default petOwnerService;

// Add a new function to fetch all pets for the authenticated user
petOwnerService.getUserPets = async () => {
  try {
    const response = await api.get('/pet-owner/my-pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching user pets:', error);
    throw error;
  }
};
