// server/controllers/foster.js
import express from 'express';
import { body, param, validationResult } from 'express-validator'; // Import validation tools
import auth from '../middleware/auth'; // Assuming auth middleware is here
import Pets from '../models/pets'; // Import Pets model
import Application from '../models/application'; // Import Application model
import User from '../models/user'; // Import User model to check role

const router = express.Router();

// @route   GET /api/foster/pets
// @desc    Get available pets for fostering
// @access  Private (Foster users only)
router.get('/pets', auth, async (req, res) => {
  // Check if the authenticated user is a foster
  if (req.user.role !== 'foster') {
    return res.status(403).json({ msg: 'Access denied. Only foster users can view available pets.' });
  }

  const { species } = req.query;
  const filter = {
    status: 'active',
    $or: [
      { origin: 'owner' },
      { organization: { $exists: true } } // Pets linked to an organization
    ]
  };

  if (species) {
    filter.Species = species;
  }

  try {
    // Find pets that are active and either from an owner or an organization
    const pets = await Pets.find(filter);
    console.log('Pets before population:', pets.map(pet => ({ _id: pet._id, origin: pet.origin, rawPetOwner: pet.petOwner })));

    // Populate petOwner if origin is 'owner'
    await Pets.populate(pets, {
      path: 'user',
      select: 'name', // Assuming User model has a 'name' field
      match: { role: 'pet_owner' } // Only populate if the referenced user is a pet-owner
    });
    console.log('Pets after population:', pets.map(pet => ({ _id: pet._id, origin: pet.origin, populatedPetOwner: pet.petOwner })));

    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foster/pets/:petId
// @desc    Get details for a specific pet available for fostering
// @access  Private (Foster users only)
router.get(
  '/pets/:petId',
  auth, // Authenticate user
  [
    // Validate petId parameter
    param('petId', 'Invalid pet ID').isMongoId(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the authenticated user is a foster
    if (req.user.role !== 'foster') {
      return res.status(403).json({ msg: 'Access denied. Only foster users can view pet details.' });
    }

    const { petId } = req.params;

    try {
      // Find the pet by ID, ensuring it's active and available for fostering
      const pet = await Pets.findOne({
        _id: petId,
        status: 'active',
        $or: [
          { origin: 'owner' },
          { organization: { $exists: true } }
        ]
      });
      console.log('Pet before population:', { _id: pet._id, origin: pet.origin, rawPetOwner: pet.petOwner });

      // Populate petOwner if origin is 'owner'
      await Pets.populate(pet, {
        path: 'petOwner',
        select: 'name', // Assuming User model has a 'name' field
        match: { role: 'pet-owner' } // Only populate if the referenced user is a pet-owner
      });
      console.log('Pet after population:', { _id: pet._id, origin: pet.origin, populatedPetOwner: pet.petOwner });


      if (!pet) {
        return res.status(404).json({ msg: 'Pet not found or not available for fostering' });
      }

      res.json(pet);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/foster/apply/:petId
// @desc    Submit a foster application for a pet
// @access  Private (Foster users only)
router.post(
  '/apply/:petId',
  auth, // Authenticate user
  [
    // Validate request body
    body('fromDate', 'Foster start date is required').notEmpty().isISO8601(),
    body('toDate', 'Foster end date is required').notEmpty().isISO8601(),
    body('policyApproved', 'Policy approval is required').isIn([true]),
    // Validate petId parameter
    param('petId', 'Invalid pet ID').isMongoId(),
  ],
  async (req, res) => {
    console.log('Request body:', req.body); // Log request body
    // Check for validation errors
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array()); // Log validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the authenticated user is a foster
    if (req.user.role !== 'foster') {
      return res.status(403).json({ msg: 'Access denied. Only foster users can submit applications.' });
    }

    const { petId } = req.params;
    const { fromDate, toDate, policyApproved } = req.body;
    const applicantId = req.user.id; // Get user ID from authenticated user

    try {
      // Check if the pet exists and is available for fostering
      const pet = await Pets.findOne({
        _id: petId,
        status: 'active',
        $or: [
          { origin: 'owner' },
          { organization: { $exists: true } }
        ]
      });

      if (!pet) {
        return res.status(404).json({ msg: 'Pet not found or not available for fostering' });
      }

      // Check if the user has already applied for fostering this pet
      const existingApplication = await Application.findOne({
        applicant: applicantId,
        pet: petId,
        applicationType: 'foster',
        status: { $in: ['pending', 'approved'] } // Consider pending or approved applications as existing
      });

      if (existingApplication) {
        return res.status(400).json({ msg: 'You have already submitted a foster application for this pet.' });
      }

      // Create a new foster application
      const newApplication = new Application({
        applicant: applicantId,
        pet: petId,
        owner: pet.origin === 'owner' ? pet.petOwner : pet.organization, // Set owner based on pet origin
        organization: pet.organization, // Link to the pet's organization if applicable
        applicationType: 'foster',
        fromDate,
        toDate,
        // status defaults to 'pending'
      });

      await newApplication.save();

      res.json({ msg: 'Foster application submitted successfully', application: newApplication });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/foster/applications
// @desc    Get foster applications for the authenticated foster user
// @access  Private (Foster users only)
router.get('/applications', auth, async (req, res) => {
  // Check if the authenticated user is a foster
  if (req.user.role !== 'foster') {
    return res.status(403).json({ msg: 'Access denied. Only foster users can view their applications.' });
  }

  try {
    // Find applications for the authenticated foster user
    const applications = await Application.find({
      applicant: req.user.id,
      applicationType: 'foster',
    }).populate('pet', ['name', 'Species', 'Breed', 'Gender', 'Size', 'Photo', 'Age']); // Populate pet details

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foster/assigned-pets
// @desc    Get pets assigned to the authenticated foster user
// @access  Private (Foster users only)
router.get('/assigned-pets', auth, async (req, res) => {
  // Check if the authenticated user is a foster
  if (req.user.role !== 'foster') {
    return res.status(403).json({ msg: 'Access denied. Only foster users can view assigned pets.' });
  }

  try {
    // Find approved foster applications for the authenticated foster user
    const assignedApplications = await Application.find({
      applicant: req.user.id,
      applicationType: 'foster',
      status: 'approved',
    }).populate('pet', ['name', 'Species', 'Breed', 'Gender', 'Size', 'Photo', 'Age', 'petOwner']); // Populate pet details including petOwner

    // Extract pets from the applications
    const assignedPets = assignedApplications.map(app => app.pet);

    res.json(assignedPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foster/applications/status/:petId
// @desc    Check if the authenticated foster user has an application for a specific pet
// @access  Private (Foster users only)
router.get(
  '/applications/status/:petId',
  auth, // Authenticate user
  [
    // Validate petId parameter
    param('petId', 'Invalid pet ID').isMongoId(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the authenticated user is a foster
    if (req.user.role !== 'foster') {
      return res.status(403).json({ msg: 'Access denied. Only foster users can check application status.' });
    }

    const { petId } = req.params;
    const applicantId = req.user.id;

    try {
      const existingApplication = await Application.findOne({
        applicant: applicantId,
        pet: petId,
        applicationType: 'foster',
        status: { $in: ['pending', 'approved'] }
      });

      if (existingApplication) {
        return res.json({ hasApplied: true, status: existingApplication.status });
      } else {
        return res.json({ hasApplied: false });
      }

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
