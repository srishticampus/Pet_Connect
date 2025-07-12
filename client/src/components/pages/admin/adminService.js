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

export const getAdopterStats = async () => {
  try {
    const response = await api.get('/admin/statistics/adopters');
    return response.data;
  } catch (error) {
    console.error('Error fetching adopter statistics:', error);
    throw error;
  }
};

export const getApplicationStats = async () => {
  try {
    const response = await api.get('/admin/statistics/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching application statistics:', error);
    throw error;
  }
};

export const getDocumentStats = async () => {
  try {
    const response = await api.get('/admin/statistics/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    throw error;
  }
};

export const getFosterStats = async () => {
  try {
    const response = await api.get('/admin/statistics/fosters');
    return response.data;
  } catch (error) {
    console.error('Error fetching foster statistics:', error);
    throw error;
  }
};

export const getLostFoundPetStats = async () => {
  try {
    const response = await api.get('/admin/statistics/lost-found-pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching lost and found pet statistics:', error);
    throw error;
  }
};

export const getPetOwnerStats = async () => {
  try {
    const response = await api.get('/admin/statistics/pet-owners');
    return response.data;
  } catch (error) {
    console.error('Error fetching pet owner statistics:', error);
    throw error;
  }
};

export const getRescueShelterStats = async () => {
  try {
    const response = await api.get('/admin/statistics/rescue-shelters');
    return response.data;
  } catch (error) {
    console.error('Error fetching rescue shelter statistics:', error);
    throw error;
  }
};

export const getAllAdopters = async () => {
  try {
    const response = await api.get('/admin/adopters');
    return response.data;
  } catch (error) {
    console.error('Error fetching adopters:', error);
    throw error;
  }
};

export const approveAdopter = async (id) => {
  try {
    const response = await api.put(`/admin/adopters/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving adopter:', error);
    throw error;
  }
};

export const rejectAdopter = async (id) => {
  try {
    const response = await api.delete(`/admin/adopters/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting adopter:', error);
    throw error;
  }
};

export const getApprovedAdopters = async () => {
  try {
    const response = await api.get('/admin/adopters/approved');
    return response.data;
  } catch (error) {
    console.error('Error fetching approved adopters:', error);
    throw error;
  }
};

export const getAllFosters = async () => {
  try {
    const response = await api.get('/admin/fosters');
    return response.data;
  } catch (error) {
    console.error('Error fetching fosters:', error);
    throw error;
  }
};

export const approveFoster = async (id) => {
  try {
    const response = await api.put(`/admin/fosters/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving foster:', error);
    throw error;
  }
};

export const rejectFoster = async (id) => {
  try {
    const response = await api.delete(`/admin/fosters/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting foster:', error);
    throw error;
  }
};

export const getApprovedFosters = async () => {
  try {
    const response = await api.get('/admin/fosters/approved');
    return response.data;
  } catch (error) {
    console.error('Error fetching approved fosters:', error);
    throw error;
  }
};

export const getAllRescueShelters = async () => {
  try {
    const response = await api.get('/admin/rescue-shelters');
    return response.data;
  } catch (error) {
    console.error('Error fetching rescue shelters:', error);
    throw error;
  }
};

export const approveRescueShelter = async (id) => {
  try {
    const response = await api.put(`/admin/rescue-shelters/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving rescue shelter:', error);
    throw error;
  }
};

export const rejectRescueShelter = async (id) => {
  try {
    const response = await api.delete(`/admin/rescue-shelters/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting rescue shelter:', error);
    throw error;
  }
};

export const getApprovedRescueShelters = async () => {
  try {
    const response = await api.get('/admin/rescue-shelters/approved');
    return response.data;
  } catch (error) {
    console.error('Error fetching approved rescue shelters:', error);
    throw error;
  }
};

export const getLostFoundPets = async (status, search) => {
  try {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }
    const response = await api.get(`/admin/lost-found-pets?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lost/found pets:', error);
    throw error;
  }
};

export const updatePetStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/lost-found-pets/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating pet status:', error);
    throw error;
  }
};

// New functions for managing applications
export const getApplications = async () => {
  try {
    const response = await api.get('/admin/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const approveApplication = async (applicationId) => {
  try {
    const response = await api.put(`/admin/applications/${applicationId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving application:', error);
    throw error;
  }
};

export const rejectApplication = async (applicationId) => {
  try {
    const response = await api.put(`/admin/applications/${applicationId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting application:', error);
    throw error;
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};
