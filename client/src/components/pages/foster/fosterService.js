// client/src/components/pages/foster/fosterService.js
import api from '../../../utils/api'; // Assuming api.js is in client/src/utils

// Function to fetch available pets, optionally filtered by species
export const getAvailablePets = async (species = '') => {
  try {
    const response = await api.get('/foster/pets', {
      params: { species }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available pets:', error);
    throw error;
  }
};

// Function to fetch details for a specific pet
export const getPetDetails = async (petId) => {
  try {
    const response = await api.get(`/foster/pets/${petId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet details for ${petId}:`, error);
    throw error;
  }
};

// Function to submit a foster application
export const applyToFoster = async (petId, applicationData) => {
  try {
    const response = await api.post(`/foster/apply/${petId}`, applicationData);
    return response.data;
  } catch (error) {
    console.error(`Error submitting foster application for ${petId}:`, error);
    throw error;
  }
};
// Function to fetch a list of distinct pet species
export const getSpeciesList = async () => {
  try {
    const response = await api.get('/pets/species');
    return response.data;
  } catch (error) {
    console.error('Error fetching species list:', error);
    throw error;
  }
};

// Function to fetch foster applications
export const getFosterApplications = async () => {
  try {
    const response = await api.get('/foster/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching foster applications:', error);
    throw error;
  }
};