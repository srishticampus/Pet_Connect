import express from 'express';
import { getLostFoundReportsForPetOwner, getLostPetById, addLostPet, editLostPet, markPetAsFound, getOwnerLostPets } from './lost-pets.js';
import auth from '../../middleware/auth.js'; // Import auth middleware (default export)
import Pets from '../../models/pets.js'; // Import the Pets model
import multer from 'multer'; // Import multer
import path from 'path'; // Import path

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Use the original file name with a timestamp to avoid conflicts
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });



// Protect all pet owner routes with authentication middleware
router.use(auth);

// Get all pets for the authenticated pet owner
router.get('/my-pets', async (req, res) => {
  try {
    // Assuming req.userId is set by the auth middleware
    const userPets = await Pets.find({ petOwner: req.userId });
    res.status(200).json(userPets);
  } catch (error) {
    console.error('Error fetching user pets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single pet by ID for the authenticated pet owner
router.get('/my-pets/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    // Assuming req.userId is set by the auth middleware
    const pet = await Pets.findOne({ _id: petId, petOwner: req.userId });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or you do not have permission to access it' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error(`Error fetching pet with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a pet by ID for the authenticated pet owner
router.put('/my-pets/:id', upload.single('image'), async (req, res) => {
  try {
    const petId = req.params.id;
    const updateData = req.body;

    // Handle healthVaccinations string to array conversion
    if (updateData.healthVaccinations && typeof updateData.healthVaccinations === 'string') {
      try {
        updateData.healthVaccinations = JSON.parse(updateData.healthVaccinations);
      } catch (parseError) {
        console.error('Error parsing healthVaccinations:', parseError);
        return res.status(400).json({ message: 'Invalid healthVaccinations format' });
      }
    }


    // If a new image is uploaded, update the Photo field
    if (req.file) {
      updateData.Photo = `/uploads/${req.file.filename}`;
    }

    // Find and update the pet, ensuring it belongs to the authenticated user
    const updatedPet = await Pets.findOneAndUpdate(
      { _id: petId, petOwner: req.userId },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found or you do not have permission to update it' });
    }

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error(`Error updating pet with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a pet by ID for the authenticated pet owner
router.delete('/my-pets/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    // Find and delete the pet, ensuring it belongs to the authenticated user
    const deletedPet = await Pets.findOneAndDelete({ _id: petId, petOwner: req.userId });

    if (!deletedPet) {
      return res.status(404).json({ message: 'Pet not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(`Error deleting pet with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all lost/found reports for the authenticated pet owner
router.get('/lost-found-reports', getLostFoundReportsForPetOwner);

// Get a single lost pet by ID for the authenticated pet owner
router.get('/lost-pets/:id', getLostPetById);

// Add a new lost pet
// Apply multer middleware to handle file upload for the 'photo' field
router.post('/lost-pets', upload.single('photo'), addLostPet); // Add validation middleware later

// Edit a lost pet
router.put('/lost-pets/:id', upload.single('photo'), editLostPet); // Add multer middleware for photo upload

// Mark a lost pet as found
router.patch('/lost-pets/:id/found', markPetAsFound);

// Get all lost pets for the authenticated pet owner
router.get('/my-lost-pets', getOwnerLostPets);

export default router;
