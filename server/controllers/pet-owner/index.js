import express from 'express';
import { getLostPets,getLostPetById, addLostPet, editLostPet, markPetAsFound } from './lost-pets.js';
import auth from '../../middleware/auth.js'; // Import auth middleware (default export)
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

// Get all lost pets for the authenticated pet owner
router.get('/lost-pets', getLostPets);

// Get a single lost pet by ID for the authenticated pet owner
router.get('/lost-pets/:id', getLostPetById);

// Add a new lost pet
// Apply multer middleware to handle file upload for the 'photo' field
router.post('/lost-pets', upload.single('photo'), addLostPet); // Add validation middleware later

// Edit a lost pet
router.put('/lost-pets/:id', editLostPet); // Add validation middleware later

// Mark a lost pet as found
router.patch('/lost-pets/:id/found', markPetAsFound);

export default router;