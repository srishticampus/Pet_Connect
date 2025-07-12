// server/controllers/admin/index.js
import express from 'express';
import { getAllPetOwners, addPetOwner, updatePetOwner, deletePetOwner } from './pet-owners.js';
import { getAllPets, addPet, updatePet, deletePet } from './pets.js';
import {
  getUserStats,
  getPetStats,
  getAdopterStats,
  getApplicationStats,
  getDocumentStats,
  getFosterStats,
  getLostFoundPetStats,
  getPetOwnerStats,
  getRescueShelterStats,
} from './statistics.js';
import { getAllAdopters, approveAdopter, rejectAdopter, getApprovedAdopters } from './adopters.js';
import { getAllFosters, approveFoster, rejectFoster, getApprovedFosters } from './fosters.js'; // Import foster controllers
import { getAllRescueShelters, approveRescueShelter, rejectRescueShelter, getApprovedRescueShelters } from './rescue-shelters.js'; // Import rescue shelter controllers
import lostFoundPetsRouter from './lost-found-pets.js';
import applicationsRouter from './applications.js'; // Import applications router
import documentsRouter from './documents.js'; // Import documents router
import User from '../../models/user.js'; // Import the User model

const router = express.Router();

// Get Admin Profile
router.get('/profile', async (req, res) => {
  try {
    // Assuming the admin user ID is available in req.user after authentication
    const adminId = req.user.id; 
    const admin = await User.findById(adminId).select('-password'); // Exclude password

    if (!admin) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/pet-owners', getAllPetOwners);
router.post('/pet-owners', addPetOwner);
router.put('/pet-owners/:id', updatePetOwner);
router.delete('/pet-owners/:id', deletePetOwner);

router.get('/pets', getAllPets);
router.post('/pets', addPet);
router.put('/pets/:id', updatePet);
router.delete('/pets/:id', deletePet);

router.get('/statistics/users', getUserStats);
router.get('/statistics/pets', getPetStats);
router.get('/statistics/adopters', getAdopterStats);
router.get('/statistics/applications', getApplicationStats);
router.get('/statistics/documents', getDocumentStats);
router.get('/statistics/fosters', getFosterStats);
router.get('/statistics/lost-found-pets', getLostFoundPetStats);
router.get('/statistics/pet-owners', getPetOwnerStats);
router.get('/statistics/rescue-shelters', getRescueShelterStats);

router.get('/adopters', getAllAdopters);
router.put('/adopters/:id/approve', approveAdopter);
router.delete('/adopters/:id/reject', rejectAdopter);
router.get('/adopters/approved', getApprovedAdopters);

router.get('/fosters', getAllFosters); // Foster routes
router.put('/fosters/:id/approve', approveFoster);
router.delete('/fosters/:id/reject', rejectFoster);
router.get('/fosters/approved', getApprovedFosters);

router.get('/rescue-shelters', getAllRescueShelters); // Rescue Shelter routes
router.put('/rescue-shelters/:id/approve', approveRescueShelter);
router.delete('/rescue-shelters/:id/reject', rejectRescueShelter);
router.get('/rescue-shelters/approved', getApprovedRescueShelters);

router.use('/lost-found-pets', lostFoundPetsRouter);
router.use('/applications', applicationsRouter); // Use applications router
router.use('/documents', documentsRouter); // Use documents router

export default router;
