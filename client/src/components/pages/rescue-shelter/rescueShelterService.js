import api from '../../../utils/api';

// Add a new pet
export const addPet = async (petData) => {
  try {
    const res = await api.post('/pets/rescue-shelter', petData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Get all pets for the authenticated rescue/shelter
export const getMyPets = async () => {
  try {
    // Assuming a GET route exists to fetch pets by the authenticated user
    // If not, this will need to be implemented on the backend
    const res = await api.get('/pets/rescue-shelter/my-pets');
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Get a specific pet by ID
export const getPetById = async (id) => {
  try {
    const res = await api.get(`/pets/rescue-shelter/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Update a pet
export const updatePet = async (id, petData) => {
  try {
    const res = await api.patch(`/pets/rescue-shelter/${id}`, petData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Delete a pet
export const deletePet = async (id) => {
  try {
    const res = await api.delete(`/pets/rescue-shelter/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// New functions for managing applications for owned pets
export const getOwnedApplications = async () => {
  try {
    const res = await api.get('/applications/owned');
    return res.data;
  } catch (err) {
    console.error('Error fetching owned applications:', err);
    throw err;
  }
};

export const approveApplicationByOwner = async (applicationId) => {
  try {
    const res = await api.put(`/applications/${applicationId}/approve-by-owner`);
    return res.data;
  } catch (err) {
    console.error('Error approving application by owner:', err);
    throw err;
  }
};

export const rejectApplicationByOwner = async (applicationId) => {
  try {
    const res = await api.put(`/applications/${applicationId}/reject-by-owner`);
    return res.data;
  } catch (err) {
    console.error('Error rejecting application by owner:', err);
    throw err;
  }
};