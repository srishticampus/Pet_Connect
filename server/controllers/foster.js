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
    const pets = await Pets.find(filter).populate('organization', 'name'); // Populate organization name

    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
    body('policyApproved', 'Policy approval is required').isBoolean().equals(true),
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

export default router;